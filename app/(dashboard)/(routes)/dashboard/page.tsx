import { UserButton } from "@clerk/nextjs";

const DashboardPage = () => {
    return (

        <div>
            <p>Dashboard page (protected) </p>
            {/* <UserButton afterSignOutUrl="/sign-in"/> */}
            {/* <UserButton afterSignOutUrl="/"/> */}
            <UserButton />
            
            </div>
       
    )
}

export default DashboardPage;