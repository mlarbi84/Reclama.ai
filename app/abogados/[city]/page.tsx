import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Star, Briefcase, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ city: string }>
}

async function getLawyers(city: string) {
  // Mock data for now - in production this would fetch from Supabase
  // When environment variables are configured, uncomment the Supabase code
  return []
  
  /* Uncomment when Supabase is configured:
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const { data, error } = await supabase
    .from('lawyers')
    .select('*')
    .ilike('city', city)
    .eq('is_active', true)
    .eq('is_verified', true)
    .order('rating', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching lawyers:', error)
    return []
  }

  return data || []
  */
}

export default async function AbogadosCityPage({ params }: PageProps) {
  const { city } = await params
  const decodedCity = decodeURIComponent(city)
  const lawyers = await getLawyers(decodedCity)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-slate-600 bg-clip-text text-transparent">
            Abogados en {decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1)}
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra al abogado perfecto para tu caso
          </p>
        </header>

        {lawyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              Configure Supabase environment variables to see lawyers in {decodedCity}
            </p>
            <p className="text-sm text-gray-500">
              Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map((lawyer: any) => (
              <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">
                        {lawyer.full_name || 'Abogado'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {lawyer.city}, {lawyer.state}
                      </CardDescription>
                    </div>
                    {lawyer.rating > 0 && (
                      <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-semibold">{lawyer.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lawyer.specialties && lawyer.specialties.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Especialidades:</p>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.specialties.slice(0, 3).map((specialty: string, i: number) => (
                            <span
                              key={i}
                              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4" />
                      <span>{lawyer.years_experience || 0} años de experiencia</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{lawyer.total_cases || 0} casos manejados</span>
                    </div>

                    {lawyer.bio && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {lawyer.bio}
                      </p>
                    )}

                    <Button className="w-full mt-4">
                      Contactar Abogado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { city } = await params
  const decodedCity = decodeURIComponent(city)
  
  return {
    title: `Abogados en ${decodedCity.charAt(0).toUpperCase() + decodedCity.slice(1)} - Reclama.AI`,
    description: `Encuentra los mejores abogados verificados en ${decodedCity}. Conecta con profesionales legales expertos.`,
  }
}
