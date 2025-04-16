class ErrorCliente extends Error {
    constructor(mensaje, codigo = 400) {
        super(mensaje)  
        this.name = 'ErrorCliente'
        this.statusCode = codigo
    }
}

export default ErrorCliente