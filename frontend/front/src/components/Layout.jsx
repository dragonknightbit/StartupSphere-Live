import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({children}){

return(
<>
<Navbar/>

<main className="flex-grow-1 d-flex flex-column min-vh-100">
{children}
</main>

<Footer/>
</>
)

}

export default Layout;