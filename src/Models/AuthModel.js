// src/Models/AuthModel.js

export async function createUserAccount({ username, password, role, updateUsername, setError, navigate }) {
    try {
        const response = await fetch('http://127.0.0.1:8000/createAccount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
        });
        const result = await response.json();
        
        if (result.error) {
            setError(result.error);
        } else {
            // Update the username in the context
            updateUsername(username);

            // Clear the error and redirect
            setError('');
            alert('Signup successful');
            navigate('/home'); // Adjust based on where you want to redirect
        }
    } catch (err) {
        setError('An error occurred. Please try again.');
    }
}

export async function loginUser({ username, password, updateUsername, setError, navigate }) {
    try {
        const response = await fetch('http://127.0.0.1:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (data.success) {
            const user = data;
            // Proceed with user role checks and navigation
            if (user.role === 'customer') {
                updateUsername(username);
                navigate('/home');
            } else if (user.role === 'storemanager') {
                navigate('/store_manager_page');
            } else if (user.role === 'salesman') {
                navigate('/salesman_page');
            }
        } else {
            setError('Invalid username or password');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('An error occurred. Please try again later.');
    }
}
