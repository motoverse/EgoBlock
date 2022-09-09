import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import TenantHeader from '../components/tenant/TenantHeader'
import { COLLECTION } from '../constants.ts/firebase';
import { PAGES } from '../constants.ts/navigation';
import { useAuth } from '../contexts/AuthContext';
import { Application, NewApplicationInput } from '../models/Application';
import { db, fromFirebaseDocs } from '../utils/firebase';
import { getWalletAuthURL } from '../utils/tenant';

export default function TenantHomePage() {
    const [showNewAppPopup, setShowNewAppPopup] = React.useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm<NewApplicationInput>();
    const slug = (watch("name") || '').toLowerCase().replace(/\W/g, '-');
    const { user } = useAuth();
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        const q = query(collection(db, COLLECTION.applications), where("owner", "==", user.uid || ''));
        return onSnapshot(q, (data) => {
            setApplications(fromFirebaseDocs(data.docs));
        })
    }, [user]);

    const onSubmit: SubmitHandler<NewApplicationInput> = async data => {
        await addDoc(collection(db, COLLECTION.applications), {
            slug,
            name: data.name,
            owner: user?.uid || '',
            authWalletCount: 0,
        });
        setShowNewAppPopup(false);
    };


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

                {applications.map(app => <div key={app.slug} className='card mt-2'>
                    <div className='card-body'>
                        <div className='d-flex justify-content-between '>
                            <div>
                                <h5 className='card-title'>{app.name}</h5>
                                <small className='card-text'>{getWalletAuthURL(app.slug)}</small>
                            </div>
                            <div className='d-flex flex-column justify-content-between align-items-end'>
                                <div className={`badge mb-2 rounded-pill ${app.authWalletCount ? 'bg-success' : 'bg-secondary'}`}>{app.authWalletCount || 0}</div>
                                <Link to={`${PAGES.applications}/${app.id}`}>
                                    <button className='btn btn-secondary'>Info</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>)}
            </div>

            <Modal show={showNewAppPopup} onHide={() => setShowNewAppPopup(false)}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Application</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Name</label>
                        <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} {...register("name", { required: true })} />
                        {errors.name && <div className="invalid-feedback">This field is required</div>}

                        <label>Slug</label>
                        <input className='form-control' disabled={true} value={slug} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" type="button" onClick={() => setShowNewAppPopup(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type='submit'>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </div>
    )
}
