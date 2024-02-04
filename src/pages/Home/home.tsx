import React from 'react'
import SearchDomain from '../../components/InputField/search-domain'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 mt-24">
      <h1 className="scroll-m-20 text-4xl text-white font-extrabold tracking-tight lg:text-5xl">
        <span className="hero__text">Find your personal .link domain</span>
      </h1>
      <SearchDomain showBtn={true} classname="" />
    </div>
  )
}

export default Home
