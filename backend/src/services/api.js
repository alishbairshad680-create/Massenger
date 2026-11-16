const API_BASE_URL = "http://localhost:5000/api";

// Common API request function
const apiRequest = async (endpoint, options = {}) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            }),
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
};

// Login user (kept for future authentication)
export const loginUser = async (email, password) => {
    const data = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });

    localStorage.setItem("token", data.token);

    return data;
};

// CONTACTS API

export const getContacts = async () => {
    return await apiRequest("/contacts");
};

export const createContact = async (contact) => {
    return await apiRequest("/contacts", {
        method: "POST",
        body: JSON.stringify(contact)
    });
};

export const updateContact = async (id, contact) => {
    return await apiRequest(`/contacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(contact)
    });
};

export const deleteContact = async (id) => {
    return await apiRequest(`/contacts/${id}`, {
        method: "DELETE"
    });
};

// EVENTS API

export const getEvents = async () => {
    return await apiRequest("/events");
};

export const createEvent = async (event) => {
    return await apiRequest("/events", {
        method: "POST",
        body: JSON.stringify(event)
    });
};

export const updateEvent = async (id, event) => {
    return await apiRequest(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(event)
    });
};

export const deleteEvent = async (id) => {
    return await apiRequest(`/events/${id}`, {
        method: "DELETE"
    });
};

// MESSAGES API
export const getMessages = async () => {
    return await apiRequest("/messages");
};

export const createMessage = async (message) => {
    return await apiRequest("/messages", {
        method: "POST",
        body: JSON.stringify(message)
    });
};


// LOGOUT

export const logoutUser = () => {
    localStorage.removeItem("token");
};