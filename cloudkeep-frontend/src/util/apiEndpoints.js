const BASE_URL = "http://localhost:8080/api/v1.0";

const API_ENDPOINTS ={
    UPLOAD_FILES:`${BASE_URL}/files/upload`,
    FETCH_FILES:`${BASE_URL}/files/my`,
    TOGGLE_PUBLIC:(fileId)=>`${BASE_URL}/files/${fileId}/toggle-public`,
    DOWNLOAD_FILE:(fileId)=>`${BASE_URL}/files/download/${fileId}`,
    DELETE_FILE:(fileId)=>`${BASE_URL}/files/delete/${fileId}`,
    GET_USER_CREDITS:`${BASE_URL}/users/credits`,
    CREATE_PAYMENT_ORDER:`${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT:`${BASE_URL}/payments/verify-payment`,
    GET_TRANSACTIONS:`${BASE_URL}/transactions`,
    PUBLIC_FILE_VIEW:(fileId)=>`${BASE_URL}/files/public/${fileId}`
}

export default API_ENDPOINTS;