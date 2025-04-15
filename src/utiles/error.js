class APIERROR extends Error {
    constructor(mensaje, codigo) {
        super(mensaje)  
        this.name = 'APIERROR'
        this.statusCode = codigo
    }
}

export default APIERROR