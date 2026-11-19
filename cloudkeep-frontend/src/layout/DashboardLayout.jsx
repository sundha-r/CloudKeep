import { useUser } from "@clerk/react"
import { Dice1 } from "lucide-react";
import Navbar from "../components/Navbar";
import SideMenu from "../components/SideMenu";


const DashboardLayout = ({children, activeMenu}) => {
    const {user}=useUser();
  return (
    <div>
        {/* navbar component */}
        <Navbar activeMenu={activeMenu}/>
        {user && (
            <div className="flex">
                <div className="max-[1080px]:hidden">
                    {/* sidemenu */}
                    <SideMenu activeMenu={activeMenu}/>
                </div>
                <div className="grow mx-5">{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout