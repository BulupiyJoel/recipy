import React from "react"
import PublicNavBar from "../components/navigation/PublicNavBar"
import Footer from "../components/Footer"

/**
 * This interface is used to declare the children for the layout
 */
interface IChildren {
     children: React.ReactNode
}

/**
 * This function create a layout to wrap all the client user GUI
 * @prop IChildren
 * @returns
 */
const ClientLayout = ({ children }: IChildren) => {
     return <>
          <div className="mx-10 mt-5 flex flex-col h-screen">
               <PublicNavBar />
               <div className="mt-8">
                    {children}
               </div>
               {/*Footer*/}
               <div className="relative bottom-0">
                    <Footer />
               </div>
          </div>
     </>
}

export default ClientLayout