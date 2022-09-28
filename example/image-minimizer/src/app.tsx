import React from 'react';
import { Image } from '@sanch941/lib';
import error from '@assets/images/big.png';

export const App = () => {
    return (
        <>
            <Image
                universal={{
                    '1x': {
                        url: '/images/random.png'
                    }
                }}
            />

            <img src={error} alt="" />
        </>
    );
};
