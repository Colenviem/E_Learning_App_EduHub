import React from 'react'

const Spinner = ({ size }) => {
    return (
        <div className="pt-24 w-full flex justify-center items-center min-h-screen">
            <div className={`animate-spin rounded-full h-${size} w-${size} border-t-4 border-indigo-600`}></div>
        </div>
    )
}

export default Spinner
