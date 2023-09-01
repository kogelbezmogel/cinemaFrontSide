import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Box, Container, ThemeProvider} from "@mui/material";
import {darkTheme} from "./theme/DarkTheme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import AddAdminForm from "./pages/AddAdminForm";
import CreateRepertoire from "./pages/CreateRepertoire";
import UserList from "./pages/UserList";
import Repertoire from "./pages/Repertoire";
import ChooseTicket from "./pages/ChooseTicket";
import BuyTicket from "./pages/BuyTicket";

const App = () => {

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Header/>
                    <Container key="main_content" maxWidth="md">
                        <Box sx={ {paddingY : 1} }>
                          <BrowserRouter>
                              <Routes>
                                  <Route path="/" element={<Home/>}/>
                                  <Route path="/repertoire" element={<Repertoire/>}/>
                                  <Route path="/login" element={<Login/>}/>
                                  <Route path="/register" element={<Register/>}/>
                                  <Route path="/chooseticket/:show_id" element={<ChooseTicket/>} />
                                  <Route path="/buyticket" element={<BuyTicket />} />
                                  <Route path="/user_list" element={<UserList />} />
                                  <Route path="/myaccount" element={<MyAccount />} />
                                  <Route path={"/add_admin"} element={<AddAdminForm />} />
                                  <Route path={"/create_repertoire"} element={<CreateRepertoire />} />
                              </Routes>
                          </BrowserRouter>
                        </Box>
                    </Container>
                <Footer/>
            </ThemeProvider>
        </>
    );
}

export default App;