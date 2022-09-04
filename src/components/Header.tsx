import React from 'react'
import { useApplication } from '../contexts/ApplicationContext'

export default function Header() {
    const { application } = useApplication();
    return (
        <header className="p-2 bold text-primary bg-dark">
            {`EgoBlock - ${application?.name}`}
        </header>
    )
}
