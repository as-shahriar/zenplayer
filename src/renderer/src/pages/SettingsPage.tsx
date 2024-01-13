import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { AppTheme } from '../../../models/enums/AppTheme';
import { CommonUtil } from '../services/CommonUtil';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';
import { APP_VERSION } from '../../../constants/appConstants';
import { Icon } from '../components/Icon';
import iconDef from '../assets/fonts/zenplayer-icon-defs.svg';

export const SettingsPage = () => {
    const [theme, setTheme] = useState<AppTheme>(AppTheme.LIGHT);
    const onThemeClick = (theme: AppTheme) => {
        CommonUtil.applyTheme(theme);
        setTheme(theme);
    };

    const renderThemeItem = () => {
        return Object.values(AppTheme).map((item) => (
            <DropdownItem key={item} onClick={() => onThemeClick(item)} className="d-flex justify-content-between align-items-center">
                {startCase(item)} {theme === item && <Icon className="ms-1" iconSpritePath={iconDef} name="check" height={12} width={12}/>}
            </DropdownItem>
        ));
    };

    useEffect(() => {
        const theme = CommonUtil.getTheme();
        setTheme(theme);
    }, []);

    return (
        <div className="p-3">
            <div className="fs-6">Settings</div>
            <div className="mt-3 mx-3">
                <span>Theme:</span>
                <UncontrolledDropdown className="d-inline-block">
                    <DropdownToggle size="sm" caret color="transparent">
                        {startCase(theme.replace('-', ' '))}
                    </DropdownToggle>
                    <DropdownMenu>{renderThemeItem()}</DropdownMenu>
                </UncontrolledDropdown>
            </div>
            <footer className="position-absolute bottom-0 right-0 px-2 py-1">
                <a
                    className="link-primary"
                    target="_blank"
                    href="https://github.com/as-shahriar/zenplayer"
                    rel="noreferrer"
                >
                    GitHub Repository
                </a>
                <span className="ms-2">version {APP_VERSION}</span>
            </footer>
        </div>
    );
};
