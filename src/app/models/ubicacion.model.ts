export interface Coordenadas {
    lat: number;
    lng: number;
}
export interface Ubicacion extends Coordenadas {
    direccion: string;
    staticMapImageUrl: string;
}