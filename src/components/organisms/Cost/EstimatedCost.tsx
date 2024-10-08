import { SubmitHandler, useForm } from 'react-hook-form'
import { SearchProductSchema, SearchProductType, SearchProductWithDistanceType } from '@/schemas/productSchema.ts'
import { Form } from '@/components/atoms/ui/form.tsx'
import FormInput from '@/components/molecules/FormInput.tsx'
import { Button } from '@/components/atoms/ui/button.tsx'
import FormSelect from '@/components/molecules/FormSelect.tsx'
import FormDatePicker from '@/components/molecules/FormDatePicker.tsx'
import { zodResolver } from '@hookform/resolvers/zod'
import SearchInput from '@/components/molecules/SearchInput.tsx'
import { useState } from 'react'
import Loading from '@/components/templates/Loading.tsx'
import { getPrice } from '@/services/deliveryService.ts'
import toast from 'react-hot-toast'
import { getDirection, getLocationByPlaceId } from '@/services/mapService.ts'
import { LngLat } from 'mapbox-gl'
import { useAuth } from '@/context/authContext.tsx'
import FormSwitch from '@/components/molecules/FormSwitch.tsx'
import { useTranslation } from 'react-i18next'

interface Props {
  setData: (data: any) => void
}

const EstimatedCost = ({ setData }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [placeIdSource, setPlaceIdSource] = useState<string>('')
  const [placeIdDestination, setPlaceIdDestination] = useState<string>('')
  const form = useForm<SearchProductType>({
    resolver: zodResolver(SearchProductSchema),
    defaultValues: {
      from: '',
      to: '',
      weight: '',
      height: '',
      width: '',
      length: '',
      type: '',
      time: new Date(Date.now())
    }
  })

  const onSubmit: SubmitHandler<SearchProductType> = async (data: SearchProductType) => {
    if (placeIdSource === '' || placeIdDestination === '') {
      return toast.error('Please choose a valid search product')
    }
    setLoading(true)
    const sourceLocation = await getLocationByPlaceId({ placeId: placeIdSource })
    const destinationLocation = await getLocationByPlaceId({ placeId: placeIdDestination })
    const lngLatSource: LngLat = sourceLocation['results'][0]['geometry']['location']
    const lngLatDestination: LngLat = destinationLocation['results'][0]['geometry']['location']

    const distanceQuery = await getDirection({ source: lngLatSource, destination: lngLatDestination })
    const distance = (distanceQuery['routes'][0]['legs'][0]['distance']['value'] / 1000) as number
    const expectedData: SearchProductWithDistanceType = {
      ...data,
      distance,
      height: Number(data.height),
      width: Number(data.width),
      weight: Number(data.weight),
      length: Number(data.length)
    }

    const response = await getPrice({ data: expectedData })
    setLoading(false)
    if (response.success) {
      // setPrice(response?.result?.data?.vehicleCost[response?.result?.data?.vehicleTypes[0]?.vehicleTypeId] as number)
      setData(response.result?.data)
      // setConfirmData({
      //   ...expectedData,
      //   longFrom: lngLatSource.lng.toString(),
      //   latFrom: lngLatSource.lat.toString(),
      //   longTo: lngLatDestination.lng.toString(),
      //   latTo: lngLatDestination.lat.toString(),
      //   pickupTime: expectedData.time,
      //   email: auth?.user?.email,
      //   totalAmount: response?.result?.data?.vehicleCost[response?.result?.data?.vehicleTypes[0]?.vehicleTypeId],
      //   vehicleTypeId: response?.result?.data?.vehicleTypes[0]?.vehicleTypeId.toString() as string
      // })
    } else {
      toast.error(response?.result?.message as string)
    }
  }
  const { t } = useTranslation()
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={' w-full bg-white backdrop-blur rounded-md'}>
        <div className={'md:w-full  grid grid-cols-6  gap-x-4 gap-y-4  py-8 px-3  '}>
          <SearchInput
            name={'from'}
            form={form}
            placeholder={'Ex: 124 Hoang Huu Nam, Tan Phu'}
            classContent={'md:col-span-6 max-sm:col-span-6'}
            setPlaceId={setPlaceIdSource}
            autoFocus
          />
          <SearchInput
            name={'to'}
            form={form}
            placeholder={'Ex: 143 Hoang Van Thu, Phu Nhuan'}
            classContent={'col-span-6 max-sm:col-span-6'}
            setPlaceId={setPlaceIdDestination}
          />

          <FormInput
            name={'width'}
            form={form}
            placeholder={'Ex: 1.2m'}
            classContent={'col-span-3 max-sm:col-span-3'}
            type={'number'}
          />
          <FormInput
            name={'length'}
            form={form}
            placeholder={'Ex: 1m'}
            classContent={'col-span-3 max-sm:col-span-3'}
            type={'number'}
          />
          <FormInput
            name={'height'}
            form={form}
            placeholder={'Ex: 2m'}
            classContent={'col-span-3 max-sm:col-span-3'}
            type={'number'}
          />

          {/*<FormInput name={'number_of_products'} form={form} placeholder={'Ex: 13'}*/}
          {/*           classContent={'col-span-3'} />*/}
          <FormInput
            name={'weight'}
            form={form}
            placeholder={'Ex: 100kg'}
            classContent={'col-span-3 max-sm:col-span-3'}
            type={'number'}
          />
          <FormSelect
            form={form}
            content={['Hang kho', 'Hang Dong Lanh', 'Thuc Pham']}
            name={'type'}
            trigger={'Select type of product'}
            enableOther={true}
            classContent={'col-span-3 max-sm:col-span-3'}
          />
          <FormDatePicker
            name={'time'}
            form={form}
            addDay={7}
            subDay={1}
            classContent={'col-span-3 max-sm:col-span-6'}
          />
          <FormSwitch name={'isInsurance'} content={'Cargo insurance'} form={form} classContent={'md:col-span-6'} />
          <FormSwitch
            name={'isHelp'}
            content={'Do you want to hire porters?'}
            form={form}
            classContent={'md:col-span-6 max-sm:col-span-6'}
          />

          <div className={'col-span-6 flex justify-end '}>
            <Button className={'bg-orangeTheme w-fit hover:bg-orangeTheme/90 px-6 '} type={'submit'}>
              Estimate
            </Button>
          </div>
        </div>
      </form>
      {loading && <Loading />}
    </Form>
  )
}

export default EstimatedCost
