import { Grid, Typography } from '@mui/material'
import parse from 'autosuggest-highlight/parse'
import throttle from 'lodash.throttle'
import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'

import Paper from '../../Paper'
import Autocomplete, { Option } from '../Autocomplete'
import TextInput from '../TextInput'

// @ts-ignore: Needs this import
import type { google } from 'google-maps'
import type { FC, HTMLAttributes } from 'react'

import type { TextInputProps } from '../TextInput'

type AddressResult = {
    company: string | undefined
    country: string | undefined
    countryCode: string | undefined
    location:
        | undefined
        | {
              latitude: number
              longitude: number
          }
    street: string | undefined
    streetNo: string | undefined
    town: string | undefined
    zipCode: number | undefined
}

interface AddressProps extends HTMLAttributes<HTMLDivElement> {
    defaultValue: any[] | any
    label: string
    onAddress: (address: AddressResult) => void
    error?: boolean
    helperText?: string
    placeTypes?: string[]
    restrictions?: { country: string[] }
}

const Address: FC<AddressProps> = ({
    defaultValue = '',
    error,
    helperText,
    label,
    onAddress,
    placeTypes = ['address'],
    restrictions = { country: ['ch'] },
}) => {
    const google = typeof window !== 'undefined' ? window.google : undefined
    const attributionElement = useRef<HTMLDivElement | null>(null)
    const placesService = useRef<google.maps.places.PlacesService>()
    const autocompleteService = useRef<google.maps.places.AutocompleteService>()

    const [place, setPlace] = useState<any>(
        defaultValue.length > 0 ? { description: defaultValue } : null
    )
    const [placeInput, setPlaceInput] = useState(defaultValue)
    const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([])

    const getPlaceSuggestions = useMemo(
        () =>
            throttle(
                (request, callback) => {
                    void autocompleteService.current!.getPlacePredictions(request, callback)
                },
                150,
                {
                    leading: false,
                    trailing: true,
                }
            ),
        []
    )

    useEffect(() => {
        if (!autocompleteService.current) {
            if (google) {
                initPlacesService()
            } else {
                return
            }
        }

        if (placeInput === '') {
            setPlaces(place ? [place] : [])
            return
        }

        getPlaceSuggestions(
            {
                componentRestrictions: restrictions,
                input: placeInput,
                types: placeTypes,
            },
            (results: any) => {
                let newOptions: any[] = []

                if (place && place?.place_id) {
                    newOptions = [place]
                }

                if (results) {
                    newOptions = [...newOptions, ...results]
                }

                setPlaces(newOptions)
            }
        )
        // eslint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
    }, [google, place, placeInput, getPlaceSuggestions])

    const initPlacesService = () => {
        if (!google) {
            return
        }

        autocompleteService.current = new google.maps.places.AutocompleteService()
        placesService.current = new google.maps.places.PlacesService(attributionElement.current!)
    }

    const getPlaceDetails = (place: google.maps.places.PlaceResult) => {
        if (!place?.place_id) {
            return
        }

        placesService.current!.getDetails({ placeId: place.place_id }, (result) => {
            if (!result) {
                return
            }

            const { address_components: address, geometry, name: company } = result

            const street = address!.find((comp) => comp.types.includes('route'))
            const streetNo = address!.find((comp) => comp.types.includes('street_number'))
            const zipCode = address!.find((comp) => comp.types.includes('postal_code'))
            const town = address!.find((comp) => comp.types.includes('locality'))
            const country = address!.find((comp) => comp.types.includes('country'))
            const location = geometry?.location
                ? {
                      latitude: geometry.location.lat(),
                      longitude: geometry.location.lng(),
                  }
                : undefined

            onAddress({
                company,
                country: country?.long_name,
                countryCode: country?.short_name,
                location,
                street: street?.long_name,
                streetNo: streetNo?.long_name,
                town: town?.long_name,
                zipCode: zipCode ? parseInt(zipCode.long_name, 10) : undefined,
            })
        })
    }

    return (
        <div>
            <Script
                onLoad={initPlacesService}
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
                strategy="lazyOnload"
            />
            <div ref={attributionElement} />
            <Autocomplete
                PaperComponent={Paper}
                autoComplete
                filterSelectedOptions
                getOptionLabel={(option: undefined | { description: string }) =>
                    option?.description || ''
                }
                includeInputInList
                onChange={(_: any, newValue: any) => {
                    getPlaceDetails(newValue)
                    setPlaces(newValue ? [newValue, ...places] : places)
                    setPlace(newValue)
                }}
                onInputChange={(_: any, newInputValue: any) => {
                    setPlaceInput(newInputValue)
                }}
                options={places}
                renderInput={(params: TextInputProps) => (
                    <TextInput label={label} {...params} error={error} helperText={helperText} />
                )}
                renderOption={(props: HTMLAttributes<HTMLLIElement>, option: any) => {
                    const matches =
                        option?.structured_formatting?.main_text_matched_substrings || []
                    const parts = parse(
                        option?.structured_formatting?.main_text,
                        matches.map((match: { length: number; offset: number }) => [
                            match.offset,
                            match.offset + match.length,
                        ])
                    )

                    return (
                        <Option {...props}>
                            <Grid alignItems="center" container>
                                <Grid item xs>
                                    {parts.map((part, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                fontWeight: part.highlight
                                                    ? 'var(--fontWeights-bold)'
                                                    : 'var(--fontWeights-default)',
                                            }}>
                                            {part.text}
                                        </span>
                                    ))}
                                    <Typography color="text.secondary" variant="body2">
                                        {option?.structured_formatting?.secondary_text || ''}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Option>
                    )
                }}
                value={place}
            />
        </div>
    )
}

export default Address
