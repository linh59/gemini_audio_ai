export default function ManageLayout({
  children
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
    return (
         <div className="min-h-screen flex w-full bg-background">
     
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {/* <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              
              <div className="flex items-center gap-2">
                
               ddd
            
              </div>
            </div>

            <div className="flex items-center gap-2">
             
              
          dd
            </div>
          </header> */}

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    )
}

