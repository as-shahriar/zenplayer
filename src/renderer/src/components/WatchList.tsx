import range from 'lodash/range';
import { Folder } from './Folder';

type WatchListProps = {};

export const WatchList = (props: WatchListProps) => {
    const {} = props;
    return (
        <div className="p-2">
            <span>Watch List</span>
            <div className="mt-4 d-flex flex-wrap gap-4">
                {range(10).map((item) => (
                    <Folder key={item} />
                ))}
            </div>
        </div>
    );
};
