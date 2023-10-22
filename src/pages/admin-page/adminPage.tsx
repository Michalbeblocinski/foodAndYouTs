import React, {useEffect, useState} from "react";
import {Navbar} from "../../components/navigation";
import EnhancedTable from "./EnhancedTable";
import EnhancedTableRecipe from "./EnhancedTableRecipe";
import {UserApp} from "../../utils/types/user";
import {useSelector} from "react-redux";
import {getUser} from "../../store/authSlice";
import {useNavigate} from "react-router-dom";


export const AdminPage: React.FC = () => {

    const [refreshPageString, setRefreshPageString] = useState<string>("false");
    const refreshAdminPage = () => {
        if (refreshPageString=="false"){setRefreshPageString("true")}
        else{setRefreshPageString("false")}
    };
    const navigate = useNavigate();
    const currentUser: UserApp = useSelector(getUser) as UserApp;
    useEffect(() => {

        if(currentUser===null){
            navigate("/login");
        }
        else if(!currentUser.role || currentUser.role===null) {
            navigate("/login");
        }
       else if(currentUser.role!=="AdminUser") {
            navigate("/");
        }

    }, [currentUser]);

    return (
        <>
            <Navbar />
            <div className="text-white ">
                <div
                    className="relative w-full my-40px before:absolute before:left-[calc(50%-161px)] before:top-!15px before:bg-white  before:w-322px before:h-2px
                    after:absolute after:left-[calc(50%-161px)] after:bottom-!15px after:bg-white  after:w-322px after:h-2px"
                >
                    <h1 className="text-3xl text-center">Admin Panel</h1>
                </div>
            </div>
            <div
                className="container mx-auto px-4 relative z-10 my-37px"
                style={{ maxWidth: "1060px" }}
            >
                {currentUser &&currentUser.role==="AdminUser"&& (
                    <div className="grid gap-24px lg:grid-cols-1 mb-24px overflow-x-auto">
                        <EnhancedTable refreshPage={refreshAdminPage}/>
                        <EnhancedTableRecipe refreshPageVariable={refreshPageString}/>
                    </div>
                )}

            </div>
            </>
    );
}