import { useContext, useState, useEffect } from 'react';
import { UserContext } from "../contexts/userContext";
import { API } from "../config/api";

import LoginComponent from '../components/LoginComp';
import TableRowAxios from '../components/TableRowAxios';

function AxiosComponent() {

    const [todos, setTodos] = useState([]);
    const [idForUpdate, setIdForUpdate] = useState(false);

    const [form, setForm] = useState({
        title: null,
        isdone: "true"
    })

    const { title, isdone } = form;

    // LOAD DATA
    const loadTodos = async () => {
        try {
            const response = await API.get("/todos");

            setTodos(response.data.data);

        } catch (error) {
            console.log("Todos Error:", error);
        }
    }

    useEffect(() => {
        loadTodos();
    }, [todos]);

    const onChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // ADD DATA
    const handleSubmit = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const body = JSON.stringify({
                title,
                isdone: isdone === "true" ? true : false,
            });


            const response = await API.post("/todo", body, config);
            const todo = response.data.data.todo;

            loadTodos();

            setForm({
                title: null,
                isdone: "true",
            });

        } catch (error) {
            console.log("handleSubmit Error:", error)
        }
    }

    const getTodoById = async (id) => {
        try {
            const response = await API.get(`/todo/${id}`);
            const todo = response.data.data;

            setIdForUpdate(todo.id);

            setForm({
                title: todo.title ? todo.title : "",
                isdone: todo.isdone ? "true" : "false",
            });

        } catch (error) {
            console.log(error);
        }
    }

    // UPDATE DATA
    const updateTodo = async () => {
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify({
                title,
                isdone: isdone === "true" ? true : false,
            });

            const response = await API.patch(`/todo/${idForUpdate}`, body, config);
            const responseTodo = response.data.data;

            const updatedTodos = todos.map((todo) =>
                todo.id == responseTodo.id ? responseTodo : todo
            );

            setTodos(updatedTodos);

            setIdForUpdate(null);

            setForm({
                title: null,
                isdone: "true",
            });
        } catch (error) {
            console.log(error);
        }
    }

    // DELETE DATA
    const deleteTodoById = async (id) => {
        try {
            await API.delete(`/todo/${id}`);
            const updatedTodo = todos.filter((todo) => todo.id !== id);

            setTodos(updatedTodo);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="mt-2 mb-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (idForUpdate) {
                            updateTodo();
                        } else {
                            handleSubmit();
                        }
                    }}
                >
                    <h3 className="text-center">Form {idForUpdate ? 'Edit' : 'Add'} Todo (Axios)</h3>
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            value={title}
                            onChange={(e) => onChange(e)}
                            name="title"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>isDone</label>
                        <select
                            className="form-control"
                            name="isdone"
                            value={isdone}
                            onChange={(e) => onChange(e)}
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button
                            className="btn btn-sm btn-primary btn-block"
                            disabled={!title || !isdone ? true : false}

                        >
                            {idForUpdate ? 'Edit' : 'Submit'} Todo
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-3 row">
                <table className="table table-sm table-bordered table-striped table-hovered">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            todos.map((todo, index) => (
                                <TableRowAxios
                                    todo={todo}
                                    index={index}
                                    key={todo.id}
                                    getTodoById={getTodoById}
                                    deleteTodoById={deleteTodoById}
                                />
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

function Axios() {
    const [state] = useContext(UserContext);

    return (
        <>
            {!state.isLogin ?
                (<LoginComponent />) :
                (<AxiosComponent />)
            }
        </>
    )
}

export default Axios;