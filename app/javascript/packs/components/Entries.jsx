import React, { useEffect, useState } from "react";
import { Card, Button, CardTitle, CardText, CardGroup, CardSubtitle } from "reactstrap";
import EntryForm from "./EntryForm";
import { DateTime } from "luxon";


function Entries({ organismId, entryForm, setEntryForm }) {
    const [ entries, setEntries ] = useState([]);
    const [ noteToEdit, setNoteToEdit ] = useState("");
    const [ dateToEdit, setDateToEdit ] = useState(DateTime.now());
    const [ entryId, setEntryId ] = useState();

    useEffect(() => {
        fetch(`/api/v1/entries/${organismId}`)
            .then(result => result.json())
            .then(result => setEntries(result));
    }, []);

    const renderEachEntry = entries.map((entry) => {
        let entryDate = DateTime.fromISO(entry.date)
        let formatDate = entryDate.toLocaleString(DateTime.DATETIME_FULL)

        function handleDeleteEntry(e) {
            fetch(`/api/v1/entries/${e.target.value}`, {
                method: "DELETE"
            })
                .then(() => fetch(`/api/v1/entries/${organismId}`))
                .then(result => result.json())
                .then(result => setEntries(result));
        }

        function handleEditEntry() {
            setNoteToEdit(entry.note);
            setDateToEdit(entryDate);
            setEntryId(entry.id);
            setEntryForm(true);
        }

        return (
            <React.Fragment>
                <Card key={entry.id}>
                    <CardTitle tag="h5">{entry.note}</CardTitle>
                    <CardSubtitle tag="h6">{formatDate}</CardSubtitle>
                    <Button onClick={handleEditEntry}>edit entry</Button>
                    <Button value={entry.id} onClick={handleDeleteEntry}>delete entry</Button>
                </Card>
            </React.Fragment>
        );
    });

    return (
        <React.Fragment>
            <h1>Entries</h1>
            <CardGroup>
                {renderEachEntry}
            </CardGroup>
            <EntryForm organismId={organismId} entries={entries} setEntries={setEntries} noteToEdit={noteToEdit} setNoteToEdit={setNoteToEdit} dateToEdit={dateToEdit} setDateToEdit={setDateToEdit} entryId={entryId} entryForm={entryForm} setEntryForm={setEntryForm} />
        </React.Fragment>
    );
}

export default Entries;