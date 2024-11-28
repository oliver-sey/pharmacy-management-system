
async function CheckUserType (role, navigate)  {
    

    //retrieve token
    const token = localStorage.getItem('token');
    try {
        //verify token
        const response = await fetch('http://localhost:8000/verify-token/' + token);

        if (!response.ok) {
            throw new Error('Token verification failed.');
        }

        //fetch current user data
        const userResponse = await fetch('http://localhost:8000/currentuser/me/', {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + token}

        })

        if (userResponse.ok) {
          const userData = await userResponse.json();

          //Put user role in local storage
          localStorage.setItem('role', userData.user_type)
          
          //if user's role is one other than the following, they are redirected back to login
          
          if (!role.includes(userData.user_type)) {
            if (userData.user_type === 'Pharmacy Manager') {
              navigate('../managerhome', {replace: true})
            } else if (userData.user_type === 'Pharmacist') {
              navigate('../pharmacisthome', {replace: true})
            } else if (userData.user_type === 'Cashier'){
              navigate('../cashierhome', {replace: true})
            } else if (userData.user_type === 'Pharmacy Technician'){
              navigate('../pharmtechhome', {replace: true})
            } else {
              navigate('../protected', {replace: true})
            }
          } else {
            console.log("From CheckUser: " + JSON.stringify(userData))
            return userData
          }
        } else {
          throw new Error("Could not authenticate")
        }

    } catch (error) {
        //if token is no longer valid, redirect to login page
        localStorage.removeItem('token');
        navigate('/');
    }
};

export default CheckUserType