import { useContext, useState } from 'react';
import { UserContext } from "../contexts/userContext";

import { API } from "../config/api";
import { useQuery, useMutation } from 'react-query';

import LoginComponent from '../components/LoginComp';
import TableRowUser from '../components/TableRowUser';

// useQuery => Read/Load
// useMutation => Create,Update,Delete

function ReactQueryComponent() {
    const [idForUpdate, setIdForUpdate] = useState(null);
    const [form, setForm] = useState({
        email: null,
        password: null,
        name: null,
    });

    const { email, password, name } = form;

    // LOAD DATA
    let { data: users, refetch } = useQuery(
        "userCache",
        async () => {
            const response = await API.get("/users");
            return response;
        }
    );
    users = users?.data?.data;

    // ADD DATA
    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        addUser.mutate();
    };

    const addUser = useMutation(async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const body = JSON.stringify({
            email,
            password,
            name,
        });

        await API.post("/register", body, config);
        refetch();

        setForm({
            email: "",
            password: "",
            name: "",
        });
    });

    // UPDATE DATA
    const getUserById = async (id) => {
        try {
            const response = await API.get(`/user/${id}`);
            const userData = response.data.data.user;
            setIdForUpdate(userData.id);
            setForm({
                name: userData.name,
                email: userData.email,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const HandleUpdateProduct = useMutation(async () => {
        const body = JSON.stringify({
            email,
            name
        });

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        await API.patch("/product/" + idForUpdate, body, config);
        refetch();
        setIdForUpdate(null);
        setForm({
            email: "",
            password: "",
            name: ""
        });
    });

    // DELETE DATA
    const deleteUserById = async (id) => {
        deleteProduct.mutate(id);
    };

    const deleteProduct = useMutation(async (id) => {
        await API.delete(`/user/${id}`);
        refetch();
    });



    return (
        <>
            <div className="mt-2 mb-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (idForUpdate) {
                            HandleUpdateProduct.mutate();
                        } else {
                            handleSubmit();
                        }
                    }}
                >
                    <h3 className="text-center">Form {idForUpdate ? 'Update' : 'Add'} User (Reac-Query)</h3>
                    {addUser.error?.response?.data && (
                        <div class="alert alert-danger py-0" role="alert">
                            {addUser.error?.response?.data?.message}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            value={email}
                            onChange={(e) => onChange(e)}
                            name="email"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    {!idForUpdate && (
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                value={password}
                                onChange={(e) => onChange(e)}
                                name="password"
                                type="text"
                                className="form-control"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            value={name}
                            onChange={(e) => onChange(e)}
                            name="name"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        {idForUpdate ? (
                            <button
                                className="btn btn-primary btn-sm btn-block"
                                disabled={!email || !name ? true : false}
                            >
                                Update User
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-sm btn-block"
                                disabled={!email || !password || !name ? true : false}
                            >
                                Submit User
                            </button>
                        )}
                    </div>
                </form>
            </div>
            {users?.length != 0 && (
                <div className="mt-3 row">
                    <table className="table table-sm table-striped table-hovered">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => (
                                <TableRowUser
                                    user={user}
                                    index={index}
                                    getUserById={getUserById}
                                    deleteUserById={deleteUserById}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

function ReactQuery() {
    const [state] = useContext(UserContext);

    return (
        <>
            {!state.isLogin ?
                (<LoginComponent />) :
                (<ReactQueryComponent />)
            }
        </>
    )
}
export default ReactQuery;