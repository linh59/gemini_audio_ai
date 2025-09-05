import Vocabularies from '@/app/(root)/vocab-dashboard/vocabularies'
import React from 'react'

const VocabDashboard = () => {
    return (
        <div>
            <div className="mb-4">
                <h1 className="title">
                    Vocabulary
                </h1>
               
            </div>

            <Vocabularies></Vocabularies>
        </div>
    )
}

export default VocabDashboard