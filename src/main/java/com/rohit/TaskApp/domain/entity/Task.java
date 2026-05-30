package com.rohit.TaskApp.domain.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name="tasks")
public class Task {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id",  updatable = false, nullable = false)
    private UUID id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description",length = 1000)
    private String description;

    @Column(name = "dueDate")
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status",nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority",nullable = false)
    private TaskPriority priority;

    @Column(name = "createdAt",nullable = false,updatable = false)
    private Instant created;

    @Column(name = "updatedAt",nullable = false)
    private Instant updated;

    public Task() {
    }

    public Task(UUID id, String title, String description, LocalDate dueDate, TaskStatus status, TaskPriority priority, Instant created, Instant updated) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.status = status;
        this.priority = priority;
        this.created = created;
        this.updated = updated;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public Instant getCreated() {
        return created;
    }

    public void setCreated(Instant created) {
        this.created = created;
    }

    public Instant getUpdated() {
        return updated;
    }

    public void setUpdated(Instant updated) {
        this.updated = updated;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;

        Task task = (Task) o;
        return Objects.equals(id, task.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

//  This toString is used to debug and not for anything else, if we do System.out.print(task) without this toString it will print address or something else, so to log this out we are using this.
    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", dueDate=" + dueDate +
                ", status=" + status +
                ", priority=" + priority +
                ", created=" + created +
                ", updated=" + updated +
                '}';
    }
}
