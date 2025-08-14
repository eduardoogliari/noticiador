import { useEffect, useRef, useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { FeedItem } from '../types/feed-item';
import FeedList from './FeedList';
import { NewSubscription, Subscription } from '../types/subscription';
import  { isValidURL } from '../utils';
import SubscriptionsList from './SubscriptionsList';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import AddSubscriptionModal from './AddSubscriptionModal';

type MainOptionInfo = {
    title : string;
    icon : string;
    itemSource : FeedItem[];
    onClick: () => void;
    getCount: () => number;
};

export default function ClientArea() {
    const [showLeftPanel, setShowLeftPanel]                           = useState(true);
    const [allFeedItems, setAllFeedItems]                             = useState<FeedItem[]>([]);
    const [feedItems, setFeedItems]                                   = useState<FeedItem[]>([]);
    const [favoriteItems, setFavoriteItems]                           = useState<FeedItem[]>([]);
    const [feedBinItems, setFeedBinItems]                             = useState<FeedItem[]>([]);
    const [faviconCache, setFaviconCache]                             = useState<Record<number, string>>({});
    const [selectedItemId, setSelectedItemId]                         = useState(-1);
    const [selectedSubscriptionId, setSelectedSubscriptionId]         = useState(-1);
    const [selectedMainOptionIndex, setSelectedMainOptionIndex] = useState(0);
    const [commentsActiveId, setCommentsActiveId]               = useState(-1);
    const [moreOptionsActiveId, setMoreOptionsActiveId]         = useState(-1);
    const [subscriptions, setSubscriptions]                           = useState<Subscription[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollToTopKey, setScrollToTopKey]                         = useState(0);
    const [isAddSubscriptionModalOpen, SetIsAddSubscriptionModalOpen] = useState(false);



    const mainOptions : MainOptionInfo[] = [
        { title: '🌐 All Feeds', itemSource: allFeedItems, icon: '', onClick: showAllFeeds, getCount: () =>  allFeedItems.filter( (i) => !i.is_read ).length },
        { title: '⭐ Favorites', itemSource: favoriteItems, icon: '', onClick: showFavorites, getCount: () => favoriteItems.length },
        { title: '🗑️ Feed Bin', itemSource: feedBinItems, icon: '', onClick: showFeedBin, getCount: () => feedBinItems.length },
    ];

    function getCurrentlyVisibleFeedItems() : FeedItem[] {
        return (selectedMainOptionIndex >= 0)
                    ? mainOptions[selectedMainOptionIndex].itemSource
                    : feedItems;
    }

    async function markItemAsRead( itemId : number ) {
        const items : FeedItem[] = getCurrentlyVisibleFeedItems();
        const foundItem = items.find( (i) => i.id === itemId );

        if( foundItem && !foundItem.is_read ) {
            await window.rssAPI.setRead( itemId, true );
            updateFeedItemsFromDb();
        }
    }

    async function setInFeedBin( itemId : number, value : boolean ) {
        await window.rssAPI.setInFeedBin( itemId, value );

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

    // async function syncFeedBinItems() {
    //     const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
    //     setFeedBinItems( binItems );
    // }

    async function syncAllFeedItems() {
        const items = await window.rssAPI.getFeeds(subscriptions);
        setAllFeedItems(items);
    }

    async function updateFeedItemsFromDb() {
        syncSelectedSubscriptionFeedItems();
        // syncFeedBinItems();
        syncAllFeedItems();
    }

    async function showAllFeeds() {
        // const items = await window.rssAPI.getFeeds(subscriptions);
        // setAllFeedItems( items );

        setScrollToTopKey( (prev) => prev+1 );
    }

    async function openInExternalBrowser( url : string ) {
        window.electronApi.openInExternalBrowser(url);
    }

    async function copyToClipboard( text : string ) {
        window.electronApi.copyToClipboard(text);
    }

    async function showFavorites() {
        // const items = await window.rssAPI.getFavorites();
        // setFavoriteItems(items);
        // setFavoriteItems( favoriteItems );
        setScrollToTopKey( (prev) => prev+1 );
    }

    async function showFeedBin() {
        // const items : FeedItem[] = [];
        // setFeedBinItems(items);
        setScrollToTopKey( (prev) => prev+1 );
    }

    async function regenerateFavicons() {
        let favicons : Record<number, string> = {};
        const subs = await window.rssAPI.getSubscriptions();
        for( const s of subs ) {
            try {
                const buffer = await window.rssAPI.getFaviconData(s.id);
                if( buffer ) {
                    const uint8       = new Uint8Array(buffer);
                    const blob        = new Blob([uint8.buffer], {type: 'image/png'});
                    const faviconData = URL.createObjectURL(blob);

                    favicons[s.id] = faviconData;

                    console.log( `Created favicon for sub id ${s.id}` );
                }
            } catch(err) {
                console.error( `Failed at regenerateFavicons() for sub id ${s.id}`, err );
            }
        }
        return favicons;
    }

    async function updateAllFeeds() {
        try {
            const subs : Subscription[] = await window.rssAPI.getSubscriptions();
            const results = await window.rssAPI.refreshFeeds(subs);
            // const results = window.rssAPI.refreshFeeds(subs);
            // const items = await window.rssAPI.getFeeds(subs);
            // setFeedItems(items);
        } catch (err) {
            console.error('Failed to load RSS feed after retries:', err);
        }
    }

    async function onClickAddSubscription() {
        SetIsAddSubscriptionModalOpen(true);
    }

    async function onCloseFeedOptionsPopup() {
        setMoreOptionsActiveId(-1);
    }

    function closeModal() {
        SetIsAddSubscriptionModalOpen(false);
    }

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

    useEffect(() => {
        ( async () => {
            const linkArr = [
                'https://news.ycombinator.com/rss',
                // 'https://alain.xyz',
                'https://brevzin.github.io/',
                'https://lobste.rs/rss',
                // 'https://kevingal.com',
                // 'https://www.vincentparizet.com/blog/',
                // 'https://www.modernescpp.com',
            ];

            for( const url of linkArr ) {
                if( isValidURL( url ) ) {
                    const feedUrl = await window.rssAPI.findFeedURL( url );

                    if( feedUrl ) {
                        console.log(feedUrl);
                        const title = await window.rssAPI.getFeedTitle( feedUrl );
                        const faviconBlob = await window.rssAPI.getFeedFavicon( feedUrl );

                        const s : NewSubscription = { name: title, url: feedUrl,  last_updated: new Date().toISOString(), favicon: faviconBlob  };
                        console.log( s );
                        await window.rssAPI.addSubscriptions(
                            [
                                s
                            ]
                        )
                    } else {
                        console.warn(`No feed found for ${url}`);
                    }
                } else {
                    console.warn(`No feed found for ${url}`);
                }
            }

            const favicons = await regenerateFavicons();
            setFaviconCache(favicons);

            const subs : Subscription[] = await window.rssAPI.getSubscriptions();
            setSubscriptions(subs);

            const favorites : FeedItem[] = await window.rssAPI.getFavorites();
            setFavoriteItems( favorites );

            // const binItems : FeedItem[] = await window.rssAPI.getFeedBinItems();
            // setFeedBinItems( binItems );

            await updateAllFeeds();

            const items = await window.rssAPI.getFeeds(subs);
            setAllFeedItems(items);
        })();
    }, [] );

    useEffect( () => {
        (async () => {
            await updateFeedItemsFromDb();
            console.log('useEffect ----------------------------------------');
        })();
    }, [favoriteItems, feedBinItems] );

    async function onFeedItemClick( itemId : number, url : string ) {
        if( itemId != selectedItemId ) {
            console.log( "onFeedItemClick: ", url );

            setSelectedItemId(itemId);

            // const items : FeedItem[] = getCurrentlyVisibleFeedItems();
            // const foundItem = items.find( (i) => i.id === itemId );

            // if( foundItem && !foundItem.is_read ) {
            //     window.rssAPI.setRead( itemId, true );
            //     updateFeedItemsFromDb();
            // }

            markItemAsRead( itemId );

        }
        window.electronApi.setWebviewURL( url );

        setCommentsActiveId(-1);
        setMoreOptionsActiveId(-1);
    }

    async function setIsFeedFavorite( itemId : number, value : boolean ) {
        await window.rssAPI.setFavorite( itemId, value);

        const items = await window.rssAPI.getFavorites();
        setFavoriteItems(items);
    }

    // async function onFeedItemFavoriteClick( itemId : number, value : boolean,  event: React.MouseEvent ) {
    //     event.stopPropagation();

    //     console.log( "onFeedItemFavoriteClick: ", itemId );
    //     await window.rssAPI.setFavorite( itemId, value);

    //     const items = await window.rssAPI.getFavorites();
    //     setFavoriteItems(items);
    // }

    async function onMoreOptionsClick( itemId : number, url: string, event: React.MouseEvent ) {
        event.stopPropagation();

        if( moreOptionsActiveId === itemId ) {
            setMoreOptionsActiveId(-1);
        } else {
            // setCommentsActiveId(-1);
            setMoreOptionsActiveId(itemId);
            // setSelectedItemId(itemId);
        }

        // if( webviewRef.current ) {
        //     if(webviewRef.current?.src !== url && commentsActiveId === -1 ) {
        //         webviewRef.current.src = url;
        //         markItemAsRead( itemId );
        //     }
        // }
    }

    async function onSubscriptionItemClick( subId : number ) {
        if( subId != selectedSubscriptionId ) {
            const foundItem = subscriptions.find( (item) => item.id == subId );
            if( foundItem ){
                console.log( "Clicked on SUB" + foundItem.url );

                const items = await window.rssAPI.getFeeds([foundItem]);

                setSelectedMainOptionIndex(-1);
                setSelectedSubscriptionId(subId);
                setFeedItems(items);

                setScrollToTopKey( (prev) => prev+1 );
            }
        }
    }

    function getFeedName( subId : number ) {

        if( selectedSubscriptionId != -1 ) {
            const foundItem = subscriptions.find( (item) => item.id == subId );
            if( foundItem ){
                return <><img src={faviconCache[subId]}></img><span>{foundItem.name}</span></>
            }
        }
        return mainOptions[selectedMainOptionIndex].title;
    }

    function onToggleSidePanelClick() {
        setShowLeftPanel(!showLeftPanel);
    }

    async function onClickMainOption( index : number ) {
        const wrappedIndex = index % mainOptions.length;
        setSelectedMainOptionIndex( wrappedIndex );
        setSelectedSubscriptionId(-1);

        console.log(wrappedIndex);
        await mainOptions[wrappedIndex].onClick();
    }

    async function onCommentsClick(itemId : number, url : string, commentsUrl: string, event: React.MouseEvent) {
        event.stopPropagation();

        if( await window.electronApi.getWebviewURL() !== commentsUrl ) {
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
        // setMoreOptionsActiveId(-1);
    }

    return (
        <div className={'client-area'}>
            <Toolbar onClickAddSubscription={onClickAddSubscription}></Toolbar>
            <PanelGroup autoSaveId="conditional" direction="horizontal">
                {
                    showLeftPanel && (
                        <>
                            <Panel id="left" className={'panel-left'} order={1} minSize={16}>
                                <ul className="main-options-list">
                                    {
                                        mainOptions.map( (item, index) => {
                                            return (
                                                <li key={index}
                                                    className={`main-options-list-item ${selectedMainOptionIndex === index ? 'selected' : ''}`}
                                                    title={item.title}
                                                    onClick={() => onClickMainOption(index)}
                                                >
                                                    {/* <img src={item.icon}></img> */}
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

                                <div className='subscriptions-header'>Subscriptions</div>
                                <SubscriptionsList faviconCache={faviconCache} onClick={onSubscriptionItemClick} subscriptions={subscriptions} selectedSubscriptionId={selectedSubscriptionId}></SubscriptionsList>

                                {/* <ExpandableGroup title='Subscriptions'>
                                    <SubscriptionsList faviconCache={faviconCache} onClick={onSubscriptionItemClick} subscriptions={subscriptions} selectedSubscriptionId={selectedSubscriptionId}></SubscriptionsList>
                                </ExpandableGroup> */}
                            </Panel>
                            <PanelResizeHandle className='panel-resizer-handle'/>
                        </>
                    )
                }
                <Panel id="center" className={'panel-middle'} order={2} minSize={26}>
                    <div className='feed-header'>{ getFeedName(selectedSubscriptionId) }</div>
                    <FeedList
                        feedItems={ getCurrentlyVisibleFeedItems() }
                        scrollToTopKey={scrollToTopKey}
                        onClick={onFeedItemClick}
                        // onFavoriteClick={onFeedItemFavoriteClick}
                        setIsFeedFavorite={setIsFeedFavorite}
                        onMoreOptionsClick={onMoreOptionsClick}
                        onCommentsClick={onCommentsClick}
                        faviconCache={faviconCache}
                        selectedItemId={selectedItemId}
                        commentsActiveId={commentsActiveId}
                        moreOptionsActiveId={moreOptionsActiveId}
                        onCloseFeedOptionsPopup={onCloseFeedOptionsPopup}
                        openInExternalBrowser={openInExternalBrowser}
                        copyToClipboard={copyToClipboard}
                        setInFeedBin={setInFeedBin}
                    ></FeedList>
                </Panel>
                {
                    <>
                        <PanelResizeHandle className='panel-resizer-handle' />
                        <Panel id="right" className={'panel-right'} order={3} minSize={30}>
                            <div ref={containerRef} style={{width: '100%', height: '100%'}}></div>
                        </Panel>
                    </>
                }
            </PanelGroup>
            <StatusBar onToggleSidePanelClick={onToggleSidePanelClick} isHidden={!showLeftPanel}></StatusBar>

            <AddSubscriptionModal isOpen={isAddSubscriptionModalOpen} onClose={closeModal}></AddSubscriptionModal>
        </div>
    );
}