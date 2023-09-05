import {clearLocalStorage} from "./utils";


// const contextUrl = "http://localhost:8080/CinemaProject";
const contextUrl = "http://localhost:8080";

// this fetch generates new tokens for access and another refresh which are saved in httpOnly cookie
export const refreshToken = () => {
    return fetch( contextUrl + "/user/refresh", {
        headers : { "Content-Type": "application/json" },
        credentials : "include",
        method : "POST",
        mode : "cors",
        body : JSON.stringify({})
    });
}


// this fetch sends loginDataObject in results 2 token are generated. One for access another one for refreshing both tokens.
export const signIn = (login, password) => {
    fetch(contextUrl + "/user/login", {
        credentials : "include",
        method : "POST",
        mode : 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body : JSON.stringify({login : login, password : password})
    }).then( res => res.json().then( res => {
        localStorage.setItem('user', res['login']);
        localStorage.setItem('roles', res['roles'].toString());
        dispatchEvent( new Event('storage') ); //this event should be caught by listeners
        window.location.replace("http://localhost:3000/");
    }))
}


export const signOut = () => {
    fetch(contextUrl + "/user/logout", {
        credentials : "include",
        method : "POST",
        mode : 'cors',
        body : JSON.stringify({})
    }).then( () => {
        console.log("User logout");
        clearLocalStorage();
        window.location.replace("http://localhost:3000/");
    } );
}


// general fetch with credentials with refreshing mechanism
export const fetchOrRefreshAndFetch = async (wholeUrl, options) => {
    let result = await fetch(wholeUrl, options);

    switch ( result.status ) {
        case 200:
            console.log("Status 200");
            break;

        case 403:
            console.log("Status 403");
            let refreshResult = await refreshToken();
            if( refreshResult.status === 200 ) {
                console.log("Then 200");
                result = await fetch(wholeUrl, options);
            }
            else {
                console.log( "Then 403" );
            }
            break;

        default:
            console.log("Status " + result.status);
            clearLocalStorage();
            break;
    }
    return result;
}


// this fetch gets user Info for account data
export const getUserInfo = async () => {
    return await fetchOrRefreshAndFetch(contextUrl + "/user/info", {
        credentials: "include",
        method: "GET",
        mod: "cors"
    });
}

// gets list with room ids
export const getRooms = async () => {
    return await fetchOrRefreshAndFetch( contextUrl + "/room/all", {
        credentials: "include",
        method: "GET",
        mod: "cors"
    });
}


export const getShowsByRoomAndDate = async (room, day) => {
    return await fetchOrRefreshAndFetch( contextUrl + `/show/${room}/${day}`, {
        credentials: "include",
        method: "GET",
        mod: "cors"
    });
}


export const getAllFilms = async () => {
    return await fetchOrRefreshAndFetch( contextUrl + `/movie/all`, {
        credentials: "include",
        method: "GET",
        mod: "cors"
    })
}


export const addShow = async (body) => {
    return await fetchOrRefreshAndFetch( contextUrl + `/show/schedule/add`, {
        headers : {"Content-Type" : "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify(body),
        mod: "cors"
    })
}

export const getShowSchedule = async (room_id, start, end) => {
    return await fetchOrRefreshAndFetch( contextUrl + `/show/schedule/select?room_id=${room_id}&start=${start}&end=${end}`, {
        credentials: "include",
        method: "GET",
        mod: "cors"
    })
}

export const deleteUser = async (user_id) => {
    return await fetchOrRefreshAndFetch(contextUrl + `/user/delete/${user_id}`, {
        credentials: "include",
        method: "GET",
        mod: "cors"
    })
}

export const getAllUsers = async () => {
    return await  fetchOrRefreshAndFetch( contextUrl  + `/user/registered`, {
        credentials: "include",
        method: "GET",
        mod: "cors"
    })
}

export const checkIfLoginAvailable = (login) => {
    return fetch( contextUrl + `/user/available/login`, {
        method: "POST",
        body: JSON.stringify({login : login}),
        mode: "cors"
    })
}

export const checkIfMailAvailable = (mail) => {
    return fetch( contextUrl + `/user/available/mail`, {
        method: "POST",
        body: JSON.stringify({mail : mail}),
        mode: "cors"
    })
}

export const signUpUser = (userData) => {
    return fetch( contextUrl + `/user/register`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(userData),
        mode: "cors"
    })
}

export const getMoviesInTimeRange = (start, end) => {
    //console.log( contextUrl + `/movie/range?start=${start}&end=${end}`)
    return fetch(
        contextUrl + `/movie/range?start=${start}&end=${end}`,
        {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
}

export const getShowsInfoForMovieInTimeRange = (id, start, end) => {
    //console.log( contextUrl + `/show/info/movie/range?movie_id=${id}&start=${start}&end=${end}`)
    return fetch( contextUrl + `/show/info/movie/range?movie_id=${id}&start=${start}&end=${end}`,
        {
            method: "GET",
            mode: 'cors'
        });
}

export const postTickets = (body) => {
    return fetch( contextUrl + "/ticket/buy", {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        mode: "cors",
        body: JSON.stringify(body)
    });
}

export const getRoomForShow = (show_id) => {
    return fetch(contextUrl + "/room/show/" + show_id,
        {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
}

export const getSitsForShow = (show_id) => {
    return fetch(contextUrl + "/sit/show/" + show_id,
        {
            method: "GET",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
}

export const deleteShowFromRepertoire = async (show_id) => {
    return await fetchOrRefreshAndFetch( contextUrl + `/show/delete/${show_id}`, {
        credentials: "include",
        method: "GET",
        mode: "cors"
    });
}

export const changeUserDetails = async (body) => {
    return await fetchOrRefreshAndFetch( contextUrl + `/user/update`, {
        credentials: "include",
        method: "POST",
        mode: "cors",
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(body)
    });
}