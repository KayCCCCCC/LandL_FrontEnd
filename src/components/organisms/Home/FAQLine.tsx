import FrequentAskedQuestion from '@/components/organisms/Home/FrequentAskedQuestion.tsx'
import bgImage from '@/assets/images/home/portrait-professor-work-educational-system.jpg'
const FaqLine = () => {
  return (
    <div className={'grid md:grid-cols-2 sm:grid-cols-1 w-full py-8'}>
      <div className={'items-center justify-center flex relative mb-4'}>
        <img
          src={bgImage}
          className={'md:w-96 md:h-96 max-sm:h-72 max-sm:w-72 object-cover  rounded-full'}
          alt={'/home-5.png'}
        />
        <img
          src={'/home-5.png'}
          className={
            ' absolute w-64 h-64  transform translate-x-1/2 translate-y-1/2 max-sm:h-40 max-sm:w-40  object-cover ml-auto rounded-full'
          }
          alt={'/home-5.png'}
        />
      </div>
      <FrequentAskedQuestion />
    </div>
  )
}

export default FaqLine
