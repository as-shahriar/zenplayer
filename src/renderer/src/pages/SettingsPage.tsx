import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { AppTheme } from '../../../models/enums/AppTheme';
import { CommonUtil } from '../services/CommonUtil';
import { useEffect, useState } from 'react';
import { startCase } from 'lodash';

export const SettingsPage = () => {
    const [theme, setTheme] = useState<AppTheme>(AppTheme.LIGHT);
    const onThemeClick = (theme: AppTheme) => {
        CommonUtil.applyTheme(theme);
        setTheme(theme);
    };

    const renderThemeItem = () => {
        return Object.values(AppTheme).map((item) => (
            <DropdownItem key={item} onClick={() => onThemeClick(item)}>
                {startCase(item)}
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
        </div>
    );
};
