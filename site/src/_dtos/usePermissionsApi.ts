// import axios from 'axios';
// import React from 'react';

// export const getUsers = async () => {
//   const data = await axios.get('/api/users/',
//     { withCredentials: true }
//   )
//     .then((api_response) => {
//       return api_response.data
//     })
//     .catch((error) => {
//       return AxiosErrorText(error);
//     });

//   return data;
// };

// export const getUserInfos = async (id: number) => {
//   const data = await axios.get(`/api/users/${id}`,
//     { withCredentials: true }
//   )
//     .then((api_response) => {
//       return api_response.data
//     })
//     .catch((error) => {
//       return AxiosErrorText(error);
//     });

//   return data;
// };

// export const getGroups = async () => {
//   const data = await axios.get('/api/groups/',
//     { withCredentials: true }
//   )
//     .then((api_response) => {
//       return api_response.data
//     })
//     .catch((error) => {
//       return AxiosErrorText(error);
//     });

//   return data;
// };

// export const createGroup = async (name) => {
//   return await axios
//     .post('/api/groups/', {
//       name
//     },
//     { withCredentials: true }
//     )
//     .then((res) => {
//       if (res.status === 201) {
//         return 'Group created';
//       }

//       return 'Other success'
//     })
//     .catch((error) => AxiosErrorText(error))
// };

// export const getGroupUsers = async (id: number) => {
//   const data = await axios.get(`/api/groups/${id}`,
//     { withCredentials: true }
//   )
//     .then((api_response) => {
//       console.log(api_response.data)
//       return api_response.data
//     })
//     .catch((error) => {
//       return AxiosErrorText(error);
//     });

//   return data;
// };

// export const getPermissions = async () => {
//   const data = await axios.get('/api/permissions/',
//     { withCredentials: true }
//   )
//     .then((api_response) => {
//       return api_response.data
//     })
//     .catch((error) => {
//       return AxiosErrorText(error);
//     });

//   console.log('chips', data);

//   return data;
// };

// export const createPermission = async (name, codename, forceCodename) => {
//   return await axios
//     .post('/api/permissions/', {
//       name,
//       codename,
//       force: forceCodename
//     },
//     { withCredentials: true }
//     )
//     .then((res) => {
//       if (res.status === 201) {
//         return 'Permission created';
//       }

//       return 'Other success';
//     })
//     .catch((error) => AxiosErrorText(error));
// }
