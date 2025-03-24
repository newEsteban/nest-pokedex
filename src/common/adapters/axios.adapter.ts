import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    // Se crea una instancia de Axios para realizar peticiones HTTP
    private axios: AxiosInstance = axios;

    /**
     * Método genérico para realizar peticiones GET a una URL dada.
     * @param url - La URL a la que se hará la petición.
     * @returns Una promesa con los datos obtenidos.
     */
    async get<T>(url: string): Promise<T> {
        try {
            // Realiza la petición GET utilizando Axios y extrae la respuesta de los datos.
            const { data } = await this.axios.get<T>(url);
            return data;
        } catch (error) {
            // Captura errores y los lanza como una nueva excepción.
            throw new Error(error);
        }
    }
}
