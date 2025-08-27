'use client'
import { useScrollShadow } from "@/hooks/use-scroll-shadow"

const TopNavigation = () => {
    const isSroll = useScrollShadow()
    console.log(isSroll)
    return (
        <header className={`header-default ${isSroll ? 'header-scrolled' : ''}`}>
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-2">

                    Audio AI Project

                </div>
            </div>

            
        </header>
    )
}

export default TopNavigation