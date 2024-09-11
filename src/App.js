import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Error from './pages/ErrorPage';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import SignIn from './pages/LogIn';
import SignUp from './pages/Ragister';
import CustomUserContext from './userContext';
import { ToastContainer } from 'react-toastify';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      errorElement: <Error />,
      children: [
        { index: true, element: <Home /> },
        { path: "/signIn", element: <SignIn /> },
        { path: "/signUp", element: <SignUp /> },
        { path: "/myOrders", element: <MyOrders /> },
        { path: "/cart", element: <Cart /> },
      ]
    },
  ]);

  return (
    <>
      <CustomUserContext>
        <RouterProvider router={router}>

        </RouterProvider>
      </CustomUserContext>
      <ToastContainer/>
    </>
  );
}

export default App;
