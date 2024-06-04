import React, {useContext} from 'react';

const BtnPrueba = () => {
    const { jwt  } = useContext(AppContext);
    const token = jwt;

    const getV = async () => {
        try {
        const response = await fetch('http://localhost:8080/blob/prueba', {
            method: 'POST',
            headers: {
            'Authorization': 'Bearer ' + token,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to get recording');
        }

        const dataResponse = await response.text();
        console.log(dataResponse);
        } catch (error) {
        console.error('Error get recording:', error);
        }
    };

    return (
        <div>
        <button onClick={getV}>Prueba post</button>
        </div>
    );
};

export default BtnPrueba;
