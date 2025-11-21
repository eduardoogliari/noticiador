import { useEffect, useMemo, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/feed-item';
import FeedList from './FeedList';
import { Subscription } from '../types/subscription';
import SubscriptionsList from './SubscriptionsList';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import { SubscriptionFilter } from '../types/subscription-filter';
import { ModalType } from '../types/modal-type';
import styles from './ClientArea.module.css';
import {useTranslation} from 'react-i18next';

enum MenuOptionView {
    All,
    Favorites,
    Bin,
    Subscriptions
}

type MainOptionInfo = {
    title : string;
    icon : string;
    itemSource : FeedItem[];
    onClick: () => void;
    getCount: () => number;
    type : MenuOptionView;
};

export default function ClientArea() {
    const { t, i18n } = useTranslation();
    const [showLeftPanel, setShowLeftPanel]                                 = useState(true);
    const [allFeedItems, setAllFeedItems]                                   = useState<FeedItem[]>([]);
    const [feedItems, setFeedItems]                                         = useState<FeedItem[]>([]);
    const [favoriteItems, setFavoriteItems]                                 = useState<FeedItem[]>([]);
    const [feedBinItems, setFeedBinItems]                                   = useState<FeedItem[]>([]);
    const [faviconCache, setFaviconCache]                                   = useState<Record<number, string>>({});
    // const [subscriptionUnreadCount, setSubscriptionUnreadCount]             = useState<Record<number, number>>({});
    // const [subscriptionFeedCount, setSubscriptionFeedCount]                 = useState<Record<number, number>>({});
    const [subscriptionNameRecord, setSubscriptionNameRecord]                 = useState<Record<number, string>>({});
    const [selectedItemId, setSelectedItemId]                               = useState(-1);
    const [selectedSubscriptionId, setSelectedSubscriptionId]               = useState(-1);
    // const [selectedMainOptionIndex, setSelectedMainOptionIndex]             = useState(0);
    const [selectedSubscriptionOptionsId, setSelectedSubscriptionOptionsId] = useState(-1);
    const [currentURL, setCurrentURL]                                       = useState('');
    const [commentsActiveId, setCommentsActiveId]                           = useState(-1);
    const [moreOptionsActiveId, setMoreOptionsActiveId]                     = useState(-1);
    const [subscriptions, setSubscriptions]                                 = useState<Subscription[]>([]);
    const [subscriptionsBeingRefreshed, setSubscriptionsBeingRefreshed]     = useState<Set<number>>(new Set([]));
    const containerRef                                                      = useRef<HTMLDivElement>(null);
    const [scrollToTopKey, setScrollToTopKey]                               = useState(0);
    const [feedRefreshKey, setFeedRefreshKey]                               = useState(0);
    const [hoveredUrl, setHoveredUrl] = useState('');
    const [selectedMenuOption, setSelectedMenuOption] = useState<MenuOptionView>( MenuOptionView.All );

    const refreshButtonDisabled = selectedMenuOption === MenuOptionView.Bin || selectedMenuOption === MenuOptionView.Favorites;
    const feedBinButtonDisabled = (selectedMenuOption === MenuOptionView.Bin) && (selectedMenuOption === MenuOptionView.Bin && feedBinItems.length === 0) || (selectedMenuOption === MenuOptionView.Favorites);

    const mainOptions : MainOptionInfo[] = [
        { title: t('all_feeds'), type: MenuOptionView.All, itemSource: allFeedItems, icon: '../icons/globe.svg', onClick: showAllFeeds, getCount: () =>  allFeedItems.length },
        { title: t('favorites'), type: MenuOptionView.Favorites, itemSource: favoriteItems, icon: '../icons/favorite.svg', onClick: showFavorites, getCount: () => favoriteItems.length },
        { title: t('feed_bin'), type: MenuOptionView.Bin, itemSource: feedBinItems, icon: '../icons/bin.svg', onClick: showFeedBin, getCount: () => feedBinItems.length },
    ];

    const subscriptionFeedCount : Record<number, number> = useMemo(() => {
        const result: Record<number, number> = {};
        for( const i of allFeedItems ) {
            const sub = i.sub_id;
            result[sub] = (result[sub] ?? 0) + 1;
        }
        return result;
    }, [allFeedItems]);

    const subscriptionUnreadCount : Record<number, number> = useMemo(() => {
        const result : Record<number,number> = {};
        for( const i of allFeedItems ) {
            if( !i.is_read ) {
                const sub = i.sub_id;
                result[sub] = (result[sub] ?? 0) + 1;
            }
        }
        return result;
    }, [allFeedItems]);

    function getMainOptionFromView( type : MenuOptionView ) {
        for( const option of mainOptions ) {
            if( option.type === type ) {
                return option;
            }
        }
        return null;
    }

    function getCurrentlyVisibleFeedItems() : FeedItem[] {
        const option = getMainOptionFromView(selectedMenuOption);
        return option?.itemSource ?? feedItems;
    }

    async function markItemAsRead( itemId : number ) {
        await window.rssAPI.setRead( itemId, true );
        await updateFeedItemsFromDb();
    }

    async function markMultipleItemsAsRead( itemIds : number[] ) {
        await window.rssAPI.setReadMultiple( itemIds, true );
        await updateFeedItemsFromDb();
    }

    async function setInFeedBin( itemIds : number[], value : boolean ) {
        await window.rssAPI.setInFeedBin( itemIds, value );

        const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
        setFeedBinItems( binItems );
    }

    async function deleteFeedItems(itemIds : number[]) {
        await window.rssAPI.deleteFeedItems(itemIds);

        const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
        setFeedBinItems( binItems );
    }

    async function syncSelectedSubscriptionFeedItems() {
        if( selectedSubscriptionId != -1 ) {
            const foundItem = subscriptions.find( (item) => item.id == selectedSubscriptionId );
            if( foundItem ){
                const items = await window.rssAPI.getFeeds([foundItem]);
                setFeedItems(items);
            }
        }
    }

    async function syncAllFeedItems() {
        const allSubs = await window.rssAPI.getSubscriptions(SubscriptionFilter.All);

        const items = await window.rssAPI.getFeeds(allSubs);
        setAllFeedItems(items);
    }

    async function updateFeedItemsFromDb() {
        await syncSelectedSubscriptionFeedItems();
        await syncAllFeedItems();
    }

    function showAllFeeds() {
        setScrollToTopKey( (prev) => prev+1 );
    }

    function openInExternalBrowser( url : string ) {
        window.electronApi.openInExternalBrowser(url);
    }

    function copyToClipboard( text : string ) {
        window.electronApi.copyToClipboard(text);
    }

    function showFavorites() {
        setScrollToTopKey( (prev) => prev+1 );
    }

    function showFeedBin() {
        setScrollToTopKey( (prev) => prev+1 );
    }

    async function regenerateFavicons() {
        let favicons : Record<number, string> = {};
        const subs = await window.rssAPI.getSubscriptions(SubscriptionFilter.All);

        console.log( 'regenerateFavicons()  subs: ', subs );
        for( const s of subs ) {
            if( !faviconCache[s.id] ) {
                try {
                    const buffer = await window.rssAPI.getFaviconData(s.id);
                    if( buffer ) {
                        const uint8       = new Uint8Array(buffer);
                        const blob        = new Blob([uint8.buffer], {type: 'image/png'});
                        const faviconData = URL.createObjectURL(blob);

                        favicons[s.id] = faviconData;

                        console.log( `Created favicon for sub id ${s.id} (${s.name})` );
                    }
                } catch(err) {
                    console.error( `Failed at regenerateFavicons() for sub id ${s.id} (${s.name})`, err );
                }
            }
        }
        setFaviconCache( prev => ({ ...prev,  ...favicons }) );
    }

    async function updateFeeds( subs : Subscription[] ) {
        console.log('updateFeeds');

        const arr : number[] = subs.filter( (item) => !subscriptionsBeingRefreshed.has( item.id ) ).map( (item) => item.id );

        if( arr.length > 0 ) {
            const filteredSubs = subscriptions.filter( (item) => arr.find( (id) => id === item.id ) );
            console.log( 'updateFeeds(): adding to update', filteredSubs );

            setSubscriptionsBeingRefreshed( (prev) => new Set([...prev, ...arr]) );

            window.rssAPI.refreshFeeds(filteredSubs).then(
                (res) => {
                    console.log( 'refreshFeeds finished: ', res );
                    setSubscriptionsBeingRefreshed( (prev) => new Set([...prev].filter( (id) => !filteredSubs.find( (i) => i.id == id ) )) );
                    setFeedRefreshKey( prev => prev + 1 );
                }
            );
        } else {
            console.log( 'updateFeeds(): nothing to update' );
        }
    }

    function onClickAddSubscription() {
        window.electronApi.openModal( { type: ModalType.AddSubscription, data: { title: t('modal_add_subscriptions_title') } } );
    }

    function onCloseSubscriptionOptionsPopup() {
        setSelectedSubscriptionOptionsId(-1);
    }

    function onCloseFeedOptionsPopup() {
        setMoreOptionsActiveId(-1);
    }

    function clearHoveredUrl() {
        setHoveredUrl('');
    }

    // Initialization useEffect
    useEffect(() => {
        ( async () => {
            const showLeftPanel = await window.electronApi.getStoreKey('showLeftPanel');
            if( typeof showLeftPanel  === "boolean" ) {
                setShowLeftPanel( showLeftPanel );
            }

            const subs : Subscription[] = await window.rssAPI.getSubscriptions(SubscriptionFilter.ActiveOnly);
            setSubscriptions(subs);

            window.rssAPI.onSubscriptionsChanged( async () => {
                const subs : Subscription[] = await window.rssAPI.getSubscriptions(SubscriptionFilter.ActiveOnly);
                setSubscriptions(subs);

                // setSelectedSubscriptionId(-1);
                // setSelectedSubscriptionOptionsId(-1);

                // setSelectedMainOptionIndex( selectedMainOptionIndex < 0 ? 0 : selectedMainOptionIndex);
            });

            window.rssAPI.onFeedBinChanged( async () => {
                const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
                setFeedBinItems( binItems );
            });

            window.webAPI.onURLChanged((url) => {
                console.log("navigated to", url);
                setCurrentURL( url );
            });

            window.electronApi.onClosePopups(() => {
                onCloseFeedOptionsPopup();
                onCloseSubscriptionOptionsPopup();
            });
        })();
    }, []);

    useEffect(() => {
        ( async () => {
            await regenerateFavicons();

            const items = await window.rssAPI.getFavorites();
            setFavoriteItems(items);

            const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
            setFeedBinItems( binItems );

            const subNames : Record<number, string> = {};
            subscriptions.map( (item) => subNames[item.id] = item.name );
            setSubscriptionNameRecord( subNames );

            updateFeeds( subscriptions );
        })();
    }, [subscriptions]);

    useEffect(() => {
        ( async () => {
            await updateFeedItemsFromDb();
        })();
    }, [feedRefreshKey]);

    useEffect(() => {
         if( selectedItemId != -1 ) {
                const foundItem = getCurrentlyVisibleFeedItems().find( (item) => item.id === selectedItemId );
                if( foundItem ) {
                    if( foundItem.comments_url === currentURL ) {
                        setCommentsActiveId( foundItem.id );
                    } else {
                        setCommentsActiveId( -1 );
                    }
                }
            }

    }, [currentURL]);

    useEffect(() => {
        if( !containerRef.current ) { return; }

        const resizeObserver = new ResizeObserver(() => {
            const rect = containerRef.current.getBoundingClientRect();

            window.electronApi.setWebviewBounds(
                rect.left,
                rect.top,
                rect.width,
                rect.height
            );
        });

        resizeObserver.observe(containerRef.current);

        const rect = containerRef.current.getBoundingClientRect();

        window.electronApi.setWebviewBounds(
            rect.left,
            rect.top,
            rect.width,
            rect.height
        );

        return () => resizeObserver.disconnect();
    }, []);

    useEffect( () => {
        (async () => {
            await updateFeedItemsFromDb();
        })();
    }, [favoriteItems, feedBinItems] );


    async function onFeedItemClick( itemId : number, url : string ) {
        if( await window.electronApi.getWebviewURL() !== url ) {
            console.log( "onFeedItemClick: ", url );
            setSelectedItemId(itemId);
            markItemAsRead( itemId );
        }
        await window.electronApi.setWebviewURL( url );
    }

    async function setIsFeedFavorite( itemId : number, value : boolean ) {
        await window.rssAPI.setFavorite( itemId, value);

        const items = await window.rssAPI.getFavorites();
        setFavoriteItems(items);
    }

    function onMoreOptionsClick( itemId : number, url: string, event: React.MouseEvent ) {
        event.stopPropagation();

        if( moreOptionsActiveId === itemId ) {
            setMoreOptionsActiveId(-1);
        } else {
            setMoreOptionsActiveId(itemId);
        }
    }

    function onMarkReadClick( itemId : number, event: React.MouseEvent ) {
        event.stopPropagation();
        markItemAsRead( itemId );
    }

    function onSubscriptionOptionsClick( subId : number, event: React.MouseEvent ) {
        event.stopPropagation();
        setSelectedSubscriptionOptionsId(subId);
    }

    async function onSubscriptionItemClick( subId : number ) {
        if( subId != selectedSubscriptionId ) {
            const foundItem = subscriptions.find( (item) => item.id === subId );
            if( foundItem ){
                console.log( "Clicked on SUB" + foundItem.url );

                const items = await window.rssAPI.getFeeds([foundItem]);

                setSelectedMenuOption( MenuOptionView.Subscriptions );
                // setSelectedMainOptionIndex(-1);
                setSelectedSubscriptionId(subId);
                setFeedItems(items);

                setScrollToTopKey( (prev) => prev+1 );
            }
        }
    }

    function getFeedName( subId : number ) {
        if( selectedSubscriptionId !== -1 ) {
            const foundItem = subscriptions.find( (item) => item.id === subId );
            if( foundItem ){
                return (
                    <span style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                        <img width={'24px'} height={'24px'} src={faviconCache[subId]}></img>
                        <span>{foundItem.name}</span>
                    </span>
                );
            }
        }
        // const index = (selectedMainOptionIndex >= 0) ? selectedMainOptionIndex : 0;
        const option = getMainOptionFromView(selectedMenuOption);
        return (
            (option) ?
                <span style={{display: 'flex', alignItems: 'end', gap: '10px'}}>
                    <img width={'24px'} height={'24px'} src={option.icon}></img>
                    <span>{option.title}</span>
                </span>
            : null
        );
    }

    async function onToggleSidePanelClick() {
        const value = !showLeftPanel;
        setShowLeftPanel(value);
        await window.electronApi.setStoreValue( 'showLeftPanel', value );
    }

    function onMouseOverFeedItem(url : string) {
        // console.log( 'onMouseOverFeedItem: ', url );
        setHoveredUrl( url );
    }

    async function onClickMainOption( option : MainOptionInfo ) {
        setSelectedMenuOption( option.type );
        setSelectedSubscriptionId(-1);
        await option.onClick();
    }

    async function onCommentsClick(itemId : number, url : string, commentsUrl: string, event: React.MouseEvent) {
        event.stopPropagation();

        const webviewURL = await window.electronApi.getWebviewURL();
        if(  webviewURL!== commentsUrl ) {
            // Different item's comment button
            setCommentsActiveId( itemId );
            window.electronApi.setWebviewURL( commentsUrl );

        } else {
            // Toggle
            const newCommentActiveValue = commentsActiveId === itemId ? -1 : commentsActiveId;

            setCommentsActiveId( newCommentActiveValue );


            if( newCommentActiveValue === -1 ) {
                window.electronApi.setWebviewURL( url );
                markItemAsRead(itemId);

            } else {
                window.electronApi.setWebviewURL( commentsUrl );
            }
        }

        setSelectedItemId(itemId);
    }

    return (
        <div className={styles['client-area']}>
            <Toolbar
                onClickAddSubscription={onClickAddSubscription}
                refreshAllFeeds={() => updateFeeds(subscriptions)}
            ></Toolbar>

            <PanelGroup autoSaveId="conditional" direction="horizontal">
                {
                    showLeftPanel && (
                        <>
                            <Panel id="left" className={styles['panel-left']} order={1} minSize={16} defaultSize={16}>
                                <ul className={styles["main-options-list"]}>
                                    {
                                        mainOptions.map( (item, index) => {
                                            return (
                                                <li key={index}
                                                    className={`${styles['main-options-list-item']} ${selectedMenuOption === item.type ? styles.selected : ''}`}
                                                    title={item.title}
                                                    onClick={() => onClickMainOption(item)}
                                                >
                                                    <img src={item.icon}></img>
                                                    <span>{`${item.title} (${item.getCount()})`}</span>
                                                </li>
                                            );
                                        } )
                                    }
                                </ul>

                                {/* <ExpandableGroup title='Categories'>
                                    <p>Technology</p>
                                    <p>Movies</p>
                                    <p>Music</p>
                                </ExpandableGroup> */}

                                <div className={styles['subscriptions-header']}>{t('subscriptions')}</div>
                                <SubscriptionsList
                                    faviconCache={faviconCache}
                                    onClickSubTitle={onSubscriptionItemClick}
                                    onClickSubOptions={onSubscriptionOptionsClick}
                                    selectedSubscriptionOptionsId={selectedSubscriptionOptionsId}
                                    subscriptions={subscriptions}
                                    selectedSubscriptionId={selectedSubscriptionId}
                                    onCloseSubOptions={onCloseSubscriptionOptionsPopup}
                                    subscriptionsBeingRefreshed={subscriptionsBeingRefreshed}
                                    subscriptionUnreadCount={subscriptionUnreadCount}
                                    subscriptionFeedCount={subscriptionFeedCount ?? {}}
                                ></SubscriptionsList>

                                {/* <ExpandableGroup title='Subscriptions'>
                                    <SubscriptionsList faviconCache={faviconCache} onClick={onSubscriptionItemClick} subscriptions={subscriptions} selectedSubscriptionId={selectedSubscriptionId}></SubscriptionsList>
                                </ExpandableGroup> */}
                            </Panel>
                            <PanelResizeHandle className={styles['panel-resizer-handle']}/>
                        </>
                    )
                }
                <Panel id="center" className={styles['panel-middle']} order={2} minSize={26}>
                    <div className={styles['feed-header']}>
                        <div className={styles['feed-header-title']}>{ getFeedName(selectedSubscriptionId) }</div>
                        <span className={styles['feed-header-buttons-container']}>

                            <button
                                className={styles['feed-header-button']}
                                title={t('hint_refresh')}
                                onClick={() => {
                                    if( selectedMenuOption === MenuOptionView.All ) {
                                        updateFeeds(subscriptions);
                                    } else {
                                        const foundItem = subscriptions.find( (item) => item.id == selectedSubscriptionId );
                                        if( foundItem ) { updateFeeds([foundItem]) }
                                    }
                                }}
                                disabled={refreshButtonDisabled}
                            >
                                <img
                                    className={styles['feed-header-button-icon']}
                                    src={
                                        (refreshButtonDisabled)
                                            ? '../icons/reload_disabled.svg'
                                            : '../icons/reload.svg'
                                    }
                                ></img>
                            </button>

                            <button
                                className={styles['feed-header-button']}
                                title={t('hint_mark_all_read')}
                                onClick={() => markMultipleItemsAsRead( getCurrentlyVisibleFeedItems().map( (item) => item.id ) )}
                            >
                                <img
                                    className={styles['feed-header-button-icon']}
                                    src={'../icons/double_check.svg'}
                                ></img>
                            </button>

                            <button
                                className={styles['feed-header-button']}
                                title={
                                    (selectedMenuOption === MenuOptionView.Bin )
                                        ? t('hint_delete_all_permanently')
                                        : t('hint_move_read_to_bin')
                                }

                                onClick={() => {
                                    if( selectedMenuOption === MenuOptionView.Bin ) {
                                        window.electronApi.openModal( { type: ModalType.ConfirmEmptyBin, data: { title: t('modal_confirm_empty_bin_title') } } )

                                    } else {
                                        setInFeedBin(
                                            getCurrentlyVisibleFeedItems()
                                                .filter( (item) => item.is_read)
                                                .map( (item) => item.id)
                                            , true
                                        );
                                    }
                                }}
                                disabled={ feedBinButtonDisabled }
                            >
                                <img
                                    className={styles['feed-header-button-icon']}
                                    src={
                                        (selectedMenuOption === MenuOptionView.Bin)
                                            ? '../icons/bin_empty.svg'
                                            : (feedBinButtonDisabled)
                                                ? '../icons/bin_disabled.svg'
                                                : '../icons/bin_check.svg'
                                    }
                                >
                                </img>
                            </button>

                        </span>
                    </div>

                    <FeedList
                        feedItems={ getCurrentlyVisibleFeedItems() }
                        subscriptionNameRecord={subscriptionNameRecord}
                        scrollToTopKey={scrollToTopKey}
                        onClick={onFeedItemClick}
                        setIsFeedFavorite={setIsFeedFavorite}
                        deleteFeedItems={deleteFeedItems}
                        onMoreOptionsClick={onMoreOptionsClick}
                        onMarkReadClick={onMarkReadClick}
                        onCommentsClick={onCommentsClick}
                        faviconCache={faviconCache}
                        selectedItemId={selectedItemId}
                        commentsActiveId={commentsActiveId}
                        moreOptionsActiveId={moreOptionsActiveId}
                        onCloseFeedOptionsPopup={onCloseFeedOptionsPopup}
                        onMouseOverFeedItem={onMouseOverFeedItem}
                        clearHoveredUrl={clearHoveredUrl}
                        openInExternalBrowser={openInExternalBrowser}
                        copyToClipboard={copyToClipboard}
                        setInFeedBin={setInFeedBin}
                    ></FeedList>
                </Panel>
                {
                    <>
                        <PanelResizeHandle className={styles['panel-resizer-handle']}/>
                        <Panel id="right" className={styles['panel-right']} order={3} minSize={30}>
                            <div ref={containerRef} style={{width: '100%', height: '100%'}}></div>
                        </Panel>
                    </>
                }
            </PanelGroup>
            <StatusBar
                onToggleSidePanelClick={onToggleSidePanelClick}
                isHidden={!showLeftPanel}
                hoveredUrl={hoveredUrl}
            ></StatusBar>
        </div>
    );
}