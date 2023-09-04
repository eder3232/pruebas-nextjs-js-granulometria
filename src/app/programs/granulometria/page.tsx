import Granulometria from './granulometria'
import { granulometriaDefaultData } from './data/granulometria-default-data'

const Page = () => {
  return (
    <div className="w-full flex justify-center">
      <Granulometria initialData={granulometriaDefaultData} />
    </div>
  )
}

export default Page
