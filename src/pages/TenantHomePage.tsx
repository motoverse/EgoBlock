import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import TenantHeader from '../components/tenant/TenantHeader'

export default function TenantHomePage() {
    const [showNewAppPopup, setShowNewAppPopup] = React.useState(false);

    const handleAppCreate = () => {
        console.log('New APP!')
    }

    return (
        <div>
            <TenantHeader />
            <div className='container mt-2'>
                <div className='d-flex justify-content-between align-items-center'>
                    <div>
                        <h2>⚔️ Applications</h2>
                        <p>It's Dangerous to Go Alone! Take this application</p>

                    </div>
                    <button className='btn btn-primary' onClick={() => setShowNewAppPopup(true)}>+ New Application</button>
                </div>
            </div>

            <Modal show={showNewAppPopup} onHide={() => setShowNewAppPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Application</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowNewAppPopup(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAppCreate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
