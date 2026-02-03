import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { claimId } = await req.json()

    if (!claimId) {
      return new Response(
        JSON.stringify({ error: 'Missing claimId' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch claim data
    const { data: claim, error: claimError } = await supabaseClient
      .from('claims')
      .select('*, users(*)')
      .eq('id', claimId)
      .single()

    if (claimError || !claim) {
      return new Response(
        JSON.stringify({ error: 'Claim not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Generate PDF content (simplified HTML version)
    // In production, you'd use a proper PDF library like react-pdf or puppeteer
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Claim ${claimId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #4F46E5; }
            .section { margin: 20px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reclama.AI - Claim Report</h1>
          <div class="section">
            <p class="label">Claim ID:</p>
            <p>${claim.id}</p>
          </div>
          <div class="section">
            <p class="label">Client Name:</p>
            <p>${claim.users.full_name || 'N/A'}</p>
          </div>
          <div class="section">
            <p class="label">Email:</p>
            <p>${claim.users.email}</p>
          </div>
          <div class="section">
            <p class="label">Claim Type:</p>
            <p>${claim.claim_type}</p>
          </div>
          <div class="section">
            <p class="label">Description:</p>
            <p>${claim.description}</p>
          </div>
          <div class="section">
            <p class="label">Incident Date:</p>
            <p>${claim.incident_date || 'N/A'}</p>
          </div>
          <div class="section">
            <p class="label">Location:</p>
            <p>${claim.location || 'N/A'}</p>
          </div>
          <div class="section">
            <p class="label">Viability Score:</p>
            <p>${claim.viability_score || 'N/A'}%</p>
          </div>
          <div class="section">
            <p class="label">Status:</p>
            <p>${claim.status}</p>
          </div>
          <div class="section">
            <p class="label">Created At:</p>
            <p>${new Date(claim.created_at).toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `

    // In production, convert HTML to PDF
    // For now, we'll store the HTML
    const fileName = `claim_${claimId}_${Date.now()}.html`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
      .from('claims')
      .upload(fileName, pdfContent, {
        contentType: 'text/html',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload document' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Update claim with document reference
    const { error: updateError } = await supabaseClient
      .from('claims')
      .update({
        documents: [...(claim.documents || []), { fileName, uploadedAt: new Date().toISOString() }],
      })
      .eq('id', claimId)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    return new Response(
      JSON.stringify({ success: true, fileName }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
