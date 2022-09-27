import React from 'react';
import { Image } from '@sanch941/lib';

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
        </>
    );
};
