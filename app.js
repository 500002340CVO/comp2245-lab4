document.addEventListener('DOMContentLoaded', () => {
    const subjectSelect = document.getElementById('subject');
    const searchForm = document.querySelector('form');
    const searchButton = searchForm.querySelector('button[type="submit"]');
    const statusDiv = document.getElementById('status');
    const tableBody = document.querySelector('#results tbody');
    const availableCheckbox = document.getElementById('available');

    fetch('subjects.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load subjects');
            }
            return response.json();
        })
        .then(subjects => {
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                subjectSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading subjects:', error);
        });

    const fetchBooks = () => {
        const params = new URLSearchParams(new FormData(searchForm));
        
        statusDiv.textContent = 'Searching...';
        searchButton.disabled = true;

        fetch(`books.php?${params}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                return response.json();
            })
            .then(books => {
                tableBody.replaceChildren();

                if (books.length === 0) {
                    statusDiv.textContent = 'No books match your search.';
                } else {
                    const countText = books.length === 1 ? '1 book found.' : `${books.length} books found.`;
                    statusDiv.textContent = countText;

                    books.forEach(book => {
                        const tr = document.createElement('tr');

                        const titleCell = document.createElement('td');
                        titleCell.textContent = book.title;

                        const authorCell = document.createElement('td');
                        authorCell.textContent = book.author;

                        const yearCell = document.createElement('td');
                        yearCell.textContent = book.year;

                        const subjectCell = document.createElement('td');
                        subjectCell.textContent = book.subject;

                        const shelfCell = document.createElement('td');
                        shelfCell.textContent = `${book.available} of ${book.copies}`;
                        if (book.available === 0) {
                            shelfCell.className = 'out';
                        }

                        tr.appendChild(titleCell);
                        tr.appendChild(authorCell);
                        tr.appendChild(yearCell);
                        tr.appendChild(subjectCell);
                        tr.appendChild(shelfCell);

                        tableBody.appendChild(tr);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading books:', error);
                tableBody.replaceChildren();
                statusDiv.textContent = "Couldn't load the books. Please try again.";
            })
            .finally(() => {
                searchButton.disabled = false;
            });
    };

    fetchBooks();

    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        fetchBooks();
    });

    subjectSelect.addEventListener('change', fetchBooks);
    availableCheckbox.addEventListener('change', fetchBooks);
});