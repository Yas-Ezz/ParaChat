package controller;

import model.ChatMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController // This annotation combines @Controller and @ResponseBody
@RequestMapping("/api/messages") // Base path for all endpoints in this controller
public class MessageRestController {

    // Using CopyOnWriteArrayList for thread safety as messages will be accessed by multiple requests
    private final List<ChatMessage> messages = new CopyOnWriteArrayList<>();

    /**
     * Handles sending a new message.
     *
     * @param chatMessage The message object received from the client.
     * @return ResponseEntity with the created message and HTTP status CREATED.
     */
    @PostMapping
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody ChatMessage chatMessage) {
        if (chatMessage.getSender() == null || chatMessage.getSender().trim().isEmpty() ||
                chatMessage.getContent() == null || chatMessage.getContent().trim().isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        chatMessage.setTimestamp(LocalDateTime.now()); // Ensure timestamp is set on server side
        messages.add(chatMessage);
        System.out.println("Received message: " + chatMessage.getContent() + " from " + chatMessage.getSender());
        return new ResponseEntity<>(chatMessage, HttpStatus.CREATED);
    }

    /**
     * Retrieves all messages currently stored in memory, sorted by timestamp.
     *
     * @return A list of all ChatMessage objects.
     */
    @GetMapping
    public ResponseEntity<List<ChatMessage>> getMessages() {
        // Return a sorted copy to ensure messages are always ordered by time
        List<ChatMessage> sortedMessages = new ArrayList<>(messages);
        Collections.sort(sortedMessages, Comparator.comparing(ChatMessage::getTimestamp));
        return new ResponseEntity<>(sortedMessages, HttpStatus.OK);
    }
}
