import { AppTheme } from '../../../models/enums/AppTheme';

export class CommonUtil {
    static THEME = 'app-theme';

    static getTheme(): AppTheme {
        const theme = localStorage.getItem(CommonUtil.THEME) as AppTheme;
        if (theme) {
            return theme;
        }
        const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (dark) {
            return AppTheme.DARK;
        }
        return AppTheme.LIGHT;
    }

    static setTheme(theme: AppTheme) {
        localStorage.setItem(CommonUtil.THEME, theme);
    }

    static applyTheme(theme = CommonUtil.getTheme()) {
        const htmlEl = document.querySelector('html');
        if (htmlEl) {
            Object.values(AppTheme).forEach((each) => {
                htmlEl.classList.remove(each);
            });
            htmlEl.classList.add(theme);
        }
        CommonUtil.setTheme(theme);
    }
}
