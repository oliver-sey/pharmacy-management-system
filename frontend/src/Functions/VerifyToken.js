
async function VerifyToken (navigate)  {
    
    //retrieve token
    const token = localStorage.getItem('token');
    try {
        //verify token
        const response = await fetch('http://localhost:8000/verify-token/' + token);

        if (!response.ok) {
            throw new Error('Token verification failed.');
        }

        //fetch current user data
        const userResponse = await fetch('http://localhost:8000/currentuser/me', {
          method: 'GET',
          headers: {'Authorization': 'Bearer ' + token}

        })

        if (userResponse.ok) {
          const userData = await userResponse.json();

          //Put user role in local storage
          //localStorage.setItem('role', userData.user_type)
        }

    } catch (error) {
        //if token is no longer valid, redirect to login page
        localStorage.removeItem('token');
        navigate('/');
    }
};

export default VerifyToken