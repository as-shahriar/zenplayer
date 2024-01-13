export class HelperService {
    static validateMedia(pathname) {
        const validFormats = ['.webm', '.3gp', '.m4v', '.mkv', '.mov', '.mp4'];
        return validFormats.some((format) => pathname.endsWith(format));
    }
}
