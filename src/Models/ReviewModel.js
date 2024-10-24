export const addReview = async (formData, setFormData, navigate) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/postReview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                formData: formData
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add review');
        }

        alert('Review added successfully');

        // Clear the form
        setFormData({
            productModelName: '',
            productCategory: '',
            productPrice: '',
            storeID: '',
            storeZip: '',
            storeCity: '',
            storeState: '',
            productOnSale: '',
            manufacturerName: '',
            manufacturerRebate: '',
            userAge: '',
            userGender: '',
            userOccupation: '',
            reviewRating: '',
            reviewText: ''
        });

        navigate('/home');
    } catch (error) {
        console.error('Error adding review:', error);
    }
};