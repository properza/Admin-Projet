import Subtitle from "../Typography/Subtitle"

  
  function TitleCard2({title, title2, subTitle, children, topMargin, TopSideButtons}){
      return(
          <div className={"card w-full p-6 bg-base-100 shadow-xl " + (topMargin || "mt-6")}>

            {/* Title for Card */}
              <Subtitle styleClass={TopSideButtons ? "inline-block" : ""}>
                <div className="flex justify-between">
                <div className="grid">
                    <div className="flex">
                        {title} <p className="text-[#7E8695] ml-2">{title2}</p>
                    </div>
                    <p className="text-[#7E8695]">{subTitle}</p>
                </div>
                    {TopSideButtons}
                </div>

                {/* Top side button, show only if present */}
                
              </Subtitle>
              
              <div className="divider mt-2"></div>
          
              {/** Card Body */}
              <div className='h-full w-full pb-6 bg-base-100'>
                  {children}
              </div>
          </div>
          
      )
  }
  
  
  export default TitleCard2