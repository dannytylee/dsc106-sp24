<script>
    import ToDo from '../components/ToDo.svelte';

    let placeholder = "What do you need to do?";
    let todo_text = "";

    let todos = [
		{ id: '0', text: 'Learn Svelte', completed: false },
	    { id: '1', text: 'Finish Lab', completed: false }
    ];

    let next_id = 2;

    function add() {
        todos = todos.concat({
            id: next_id,
            text: todo_text,
            completed: false,
        });
        next_id = next_id + 1;
        todo_text = "";
    }

    function removeTodo(id) {
        todos = todos.filter((todo) => todo.id !== id);
    }
</script>

<main>
    <h1>todos</h1>

    <section class="todos">
       <form on:submit|preventDefault={add}>
            <input {placeholder} bind:value={todo_text} />
        </form>

        {#each todos as todo (todo.id)}
            <ToDo bind:todo={todo} {removeTodo}/>
        {/each}
    </section>

</main>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap');

    :root {
        --color-bg: #a6a6a6;
        --color-outline:  #00ff0a;
        --color-shadow: #000000;
        --color-text: #ff00dd;
    }

    *,
    *::before,
    *::after {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    main {
        height: 100%;
        display: grid;
        place-content: center;
        text-align: center;
        font-family: 'Nunito', sans-serif;
        font-weight: 300;
        line-height: 2;
        font-size: 24px;
        color: var(--color-text);
    }

    input,
    button {
        font-family: inherit;
        font-weight: inherit;
        line-height: inherit;
        font-size: 24px;
        width: 100%;
    }

    h1 {
        font-size: 72px;
        font-weight: 300;
        line-height: 2;
    }

    .todos {
        width: 500px;
        background-color: var(--color-bg);
        border-radius: 5px;
        border: 1px solid var(--color-outline);
        box-shadow: 0 0 4px var(--color-shadow);
    }
</style>
