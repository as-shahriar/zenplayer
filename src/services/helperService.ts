export class HelperService {
    static validateMedia(pathname) {
        return pathname.endsWith('.mp4');
    }
}
