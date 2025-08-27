import TopNavigation from "@/components/top-navigation";

export default function ManageLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
    return (
         <div className="min-h-screen flex w-full bg-background">
     
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
         <TopNavigation/>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    )
}

