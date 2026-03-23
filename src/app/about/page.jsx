import React from 'react'

const About = () => {
  return (
   <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-xl px-4 md:px-8">
    <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">
      What others say about us
    </h2>
    <div className="grid gap-4 md:grid-cols-2 md:gap-8">
      {/* quote - start */}
      <div className="flex flex-col items-center gap-4 rounded-lg bg-indigo-500 px-8 py-6 md:gap-6">
        <div className="max-w-md text-center text-white lg:text-lg">
          “This is a section of some simple filler text, also known as
          placeholder text.”
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-100 bg-gray-100 md:h-14 md:w-14">
            <img
              src="https://images.unsplash.com/photo-1567515004624-219c11d31f2e??auto=format&q=75&fit=crop&w=112"
              loading="lazy"
              alt="Photo by Radu Florin"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div>
            <div className="text-center text-sm font-bold text-indigo-50 sm:text-left md:text-base">
              John McCulling
            </div>
            <p className="text-center text-sm text-indigo-200 sm:text-left md:text-sm">
              CEO / Datadrift
            </p>
          </div>
        </div>
      </div>
      {/* quote - end */}
      {/* quote - start */}
      <div className="flex flex-col items-center gap-4 rounded-lg bg-indigo-500 px-8 py-6 md:gap-6">
        <div className="max-w-md text-center text-white lg:text-lg">
          “This is a section of some simple filler text, also known as
          placeholder text.”
        </div>
        <div className="flex flex-col items-center gap-2 sm:flex-row md:gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-indigo-100 bg-gray-100 md:h-14 md:w-14">
            <img
              src="https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?auto=format&q=75&fit=crop&w=112"
              loading="lazy"
              alt="Photo by christian ferrer"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div>
            <div className="text-center text-sm font-bold text-indigo-50 sm:text-left md:text-base">
              Kate Berg
            </div>
            <p className="text-center text-sm text-indigo-200 sm:text-left md:text-sm">
              CFO / Dashdash
            </p>
          </div>
        </div>
      </div>
      {/* quote - end */}
    </div>
  </div>
</div>

  )
}

export default About